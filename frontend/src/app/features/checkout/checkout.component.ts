// features/checkout/checkout.component.ts
import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  private cartService = inject(CartService);
  private router = inject(Router);

  cartItems = this.cartService.cartItems;
  cartTotal = this.cartService.cartTotal;

  // Dados do formulário
  customer = {
    name: '',
    email: '',
    phone: '',
    cpf: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    paymentMethod: 'pix'
  };

  get total(): number {
    return this.cartTotal();
  }

  get itemsCount(): number {
    return this.cartItems().reduce((sum, i) => sum + i.quantity, 0);
  }

  buscarCep(): void {
    if (this.customer.cep.length === 8) {
      // Mock - depois integrar com ViaCEP
      this.customer.street = 'Rua Exemplo';
      this.customer.neighborhood = 'Centro';
      this.customer.city = 'São Paulo';
      this.customer.state = 'SP';
    }
  }

  finalizarPedido(): void {
    if (!this.isFormValid()) return;

    const pedido = {
      id: Math.floor(Math.random() * 100000),
      customer: this.customer,
      items: this.cartItems(),
      total: this.total,
      date: new Date()
    };

    console.log('Pedido finalizado:', pedido);

    // Limpar carrinho e redirecionar
    this.cartService.clearCart();
    this.router.navigate(['/order-confirmed', pedido.id]);
  }

  isFormValid(): boolean {
    return !!(
      this.customer.name &&
      this.customer.email &&
      this.customer.phone &&
      this.customer.cep &&
      this.customer.street &&
      this.customer.number
    );
  }
}
