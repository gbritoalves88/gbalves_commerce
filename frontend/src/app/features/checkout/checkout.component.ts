// features/checkout/checkout.component.ts
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { CarrinhoService } from '../../shared/services/carrinho.service';
import { PedidoService } from '../../shared/services/pedido.service';
import { AuthService } from '../../shared/services/auth.service';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatRadioModule, FormsModule, RouterModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  private carrinhoService = inject(CarrinhoService);
  private pedidoService = inject(PedidoService);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  cartItems = this.carrinhoService.cartItems;
  cartTotal = this.carrinhoService.cartTotal;

  cliente = {
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    formaPagamento: 'pix'
  };

  loading = false;

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.cliente.nome = user.nome || '';
      this.cliente.email = user.email || '';
      this.cliente.telefone = user.telefone || '';
      this.cliente.cpf = user.cpf || '';
      this.cdr.markForCheck();
    }
  }

  get total(): number {
    return this.cartTotal();
  }

  buscarCep(): void {
    if (this.cliente.cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${this.cliente.cep}/json/`)
        .then(r => r.json())
        .then(data => {
          if (!data.erro) {
            this.cliente.rua = data.logradouro;
            this.cliente.bairro = data.bairro;
            this.cliente.cidade = data.localidade;
            this.cliente.estado = data.uf;
            this.cdr.markForCheck();
          }
        });
    }
  }

  finalizarPedido(): void {
    if (!this.isFormValid() || this.loading) return;
    this.loading = true;

    const pedido = {
      clienteNome: this.cliente.nome,
      clienteEmail: this.cliente.email,
      clienteTelefone: this.cliente.telefone,
      clienteCpf: this.cliente.cpf,
      cep: this.cliente.cep,
      rua: this.cliente.rua,
      numero: this.cliente.numero,
      complemento: this.cliente.complemento,
      bairro: this.cliente.bairro,
      cidade: this.cliente.cidade,
      estado: this.cliente.estado,
      formaPagamento: this.cliente.formaPagamento,
      itens: this.cartItems().map(i => ({
        produtoId: i.produto.id,
        quantidade: i.quantidade
      }))
    };

    this.pedidoService.criar(pedido).subscribe({
      next: (response) => {
        this.carrinhoService.clearCart();
        this.alertService.success('Pedido realizado com sucesso!');
        this.router.navigate(['/pedido-confirmado', response.id]);
      },
      error: () => {
        this.alertService.error('Erro ao finalizar pedido. Tente novamente.');
        this.loading = false;
      }
    });
  }

  isFormValid(): boolean {
    return !!(
      this.cliente.nome &&
      this.cliente.email &&
      this.cliente.telefone &&
      this.cliente.cep &&
      this.cliente.rua &&
      this.cliente.numero
    );
  }
}
