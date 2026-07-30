// features/checkout/checkout.component.ts
import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { CarrinhoService } from '../../shared/services/carrinho.service';
import { PedidoService } from '../../shared/services/pedido.service';

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
export class CheckoutComponent {
  private cartService = inject(CarrinhoService);
  private pedidoService = inject(PedidoService);
  private router = inject(Router);

  cartItems = this.cartService.cartItems;
  cartTotal = this.cartService.cartTotal;

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

  get total(): number {
    return this.cartTotal();
  }

  get itemsCount(): number {
    return this.cartItems().reduce((sum, i) => sum + i.quantidade, 0);
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
        this.cartService.clearCart();
        this.router.navigate(['/pedido-confirmado', response.id]);
      },
      error: () => {
        alert('Erro ao finalizar pedido. Tente novamente.');
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
