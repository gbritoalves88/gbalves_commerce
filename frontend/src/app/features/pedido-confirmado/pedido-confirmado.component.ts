import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PedidoService } from '../../shared/services/pedido.service';
import { PagamentoService } from '../../shared/services/pagamento.service';
import { AlertService } from '../../shared/services/alert.service';
import { PedidoResponse } from '../../shared/models/pedido';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pedido-confirmado',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterModule, DatePipe],
  templateUrl: './pedido-confirmado.component.html',
  styleUrl: './pedido-confirmado.component.scss'
})
export class PedidoConfirmadoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private pedidoService = inject(PedidoService);
  private pagamentoService = inject(PagamentoService);
  private alertService = inject(AlertService);

  pedidoId: string = '';
  pedido = signal<PedidoResponse | null>(null);
  loading = signal(true);
  qrCode = signal('');
  qrCodeBase64 = signal('');
  gerandoPix = signal(false);

  ngOnInit(): void {
    this.pedidoId = this.route.snapshot.paramMap.get('id') || '';
    if (this.pedidoId) {
      this.pedidoService.obterPorId(this.pedidoId).subscribe({
        next: (p) => {
          this.pedido.set(p);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  get formaPagamento(): string {
    const fp = this.pedido()?.formaPagamento;
    if (!fp) return 'Não informado';
    if (fp === 'Pix') return 'Pix';
    if (fp === 'CartaoCredito') return 'Cartão de Crédito';
    return fp;
  }

  get statusPagamento(): string {
    const sp = this.pedido()?.statusPagamento;
    if (!sp) return 'Não informado';
    if (sp === 'Aprovado' || sp === 'Approved') return 'Aprovado ✅';
    if (sp === 'Pendente' || sp === 'Pending') return 'Pendente ⏳';
    return sp;
  }

  get podePagarComPix(): boolean {
    const fp = this.pedido()?.formaPagamento;
    const sp = this.pedido()?.statusPagamento;

    // Só mostra PIX se:
    // - Forma de pagamento é Pix OU não tem forma definida
    // - Status do pagamento é Pendente OU não informado
    return (
      (!fp || fp === 'Pix') &&
      (!sp || sp === 'Pendente' || sp === 'Pending')
    );
  }

  gerarPix(): void {
    if (!this.pedidoId || this.gerandoPix()) return;

    this.gerandoPix.set(true);

    this.pagamentoService.criarCheckout({
      pedidoId: this.pedidoId,
      metodoPagamento: 'pix',
      emailComprador: this.pedido()?.clienteEmail || '',
      nomeComprador: this.pedido()?.clienteNome || ''
    }).subscribe({
      next: (res) => {
        if (res.qrCode) {
          this.qrCode.set(res.qrCode);
        }
        if (res.qrCodeBase64) {
          this.qrCodeBase64.set(res.qrCodeBase64);
        }
        this.gerandoPix.set(false);
      },
      error: (err) => {
        this.gerandoPix.set(false);
        this.alertService.error(err.error?.erro || 'Erro ao gerar PIX');
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
}
