// features/pagamento/pagamento.component.ts
import { Component, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../shared/services/alert.service';
import { AuthService } from '../../shared/services/auth.service';
import { PagamentoService } from '../../shared/services/pagamento.service';
import { environment } from '../../../environments/environment';

declare var MercadoPago: any;

@Component({
  selector: 'app-pagamento',
  standalone: true,
  imports: [
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, FormsModule, RouterModule
  ],
  templateUrl: './pagamento.component.html',
  styleUrl: './pagamento.component.scss'
})
export class PagamentoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private alertService = inject(AlertService);
  private authService = inject(AuthService);
  private pagamentoService = inject(PagamentoService);
  private cdr = inject(ChangeDetectorRef);

  pedidoId: string = '';
  qrCode = signal('');
  qrCodeBase64 = signal('');
  pagamentoId = signal('');
  loading = signal(false);
  emailComprador = '';
  nomeComprador = '';
  metodoSelecionado: 'pix' | 'cartao' = 'pix';
  status = signal('');

  cardNumber = '';
  cardName = '';
  cardExpMonth = '';
  cardExpYear = '';
  cardCvv = '';
  cardCpf = '';
  parcelas = 1;

  ngOnInit(): void {
    this.pedidoId = this.route.snapshot.paramMap.get('pedidoId') || '';

    // Ler forma de pagamento do query param
    const metodo = this.route.snapshot.queryParamMap.get('metodo');
    if (metodo === 'cartao' || metodo === 'cartao_credito') {
      this.metodoSelecionado = 'cartao';
    } else {
      this.metodoSelecionado = 'pix';

      // Se for PIX, gera o QR Code automaticamente
      setTimeout(() => this.gerarPix(), 100);
    }

    const user = this.authService.currentUser();
    if (user) {
      this.emailComprador = user.email || '';
      this.nomeComprador = user.nome || '';
    }
  }

  selecionarMetodo(metodo: 'pix' | 'cartao'): void {
    this.metodoSelecionado = metodo;

    if (metodo === 'pix' && !this.qrCode() && !this.loading()) {
      this.gerarPix();
    }
  }

  gerarPix(): void {
    this.loading.set(true);
    this.pagamentoService.criarCheckout({
      pedidoId: this.pedidoId,
      metodoPagamento: 'pix',
      emailComprador: this.emailComprador,
      nomeComprador: this.nomeComprador
    }).subscribe({
      next: (res) => {
        // ========== NOVO CONTRATO ==========
        this.status.set(res.status);
        this.pagamentoId.set(res.pagamentoId);

        if (res.qrCodeBase64) {
          this.qrCodeBase64.set(res.qrCodeBase64);
        }

        if (res.qrCode) {
          this.qrCode.set(res.qrCode);
        }

        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.alertService.error(err.error?.erro || 'Erro ao gerar Pix');
        this.loading.set(false);
      }
    });
  }

  copiarPix(): void {
    if (this.qrCode()) {
      navigator.clipboard.writeText(this.qrCode()).then(() => {
        this.alertService.success('Código PIX copiado!');
      }).catch(() => {
        this.alertService.error('Erro ao copiar');
      });
    }
  }

  pagarCartao(): void {
    if (!this.cardNumber || !this.cardName || !this.cardCvv) {
      this.alertService.error('Preencha todos os dados do cartão');
      return;
    }

    this.loading.set(true);

    const mp = new MercadoPago(environment.mercadoPagoPublicKey);

    mp.createCardToken({
      cardNumber: this.cardNumber.replace(/\s/g, ''),
      cardholderName: this.cardName,
      cardExpirationMonth: this.cardExpMonth,
      cardExpirationYear: this.cardExpYear,
      securityCode: this.cardCvv,
      identificationType: 'CPF',
      identificationNumber: this.cardCpf
    }).then((token: any) => {
      console.log('✅ Token:', token.id);

      this.pagamentoService.criarCheckout({
        pedidoId: this.pedidoId,
        metodoPagamento: this.detectarBandeira(this.cardNumber),
        emailComprador: this.emailComprador,
        nomeComprador: this.nomeComprador,
        cpfComprador: this.cardCpf,
        token: token.id,
        parcelas: this.parcelas
      }).subscribe({
        next: (res) => {
          // ========== NOVO CONTRATO: usa res.status ==========
          this.status.set(res.status);
          this.pagamentoId.set(res.pagamentoId);
          this.loading.set(false);
          this.cdr.markForCheck();

          if (res.status === 'approved') {
            this.alertService.success('Pagamento aprovado!');
            this.router.navigate(['/pedido-confirmado', this.pedidoId]);
          } else if (res.status === 'pending') {
            this.alertService.error('Pagamento pendente. Tente novamente.');
          } else if (res.status === 'rejected') {
            this.alertService.error('Pagamento recusado! Verifique os dados do cartão.');
          } else {
            this.alertService.error('Status: ' + res.status);
          }
        },
        error: (err) => {
          this.alertService.error(err.error?.erro || 'Erro ao processar pagamento');
          this.loading.set(false);
        }
      });
    }).catch((err: any) => {
      console.error('❌ Erro:', err);
      this.alertService.error('Erro ao validar cartão');
      this.loading.set(false);
    });
  }

  detectarBandeira(numero: string): string {
    if (numero.startsWith('4')) return 'visa';
    if (numero.startsWith('5')) return 'mastercard';
    if (numero.startsWith('34') || numero.startsWith('37')) return 'amex';
    return 'mastercard';
  }
}
