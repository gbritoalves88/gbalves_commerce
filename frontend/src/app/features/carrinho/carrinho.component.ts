// features/carrinho/carrinho.component.ts
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CarrinhoService } from '../../shared/services/carrinho.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.scss'
})
export class CarrinhoComponent {
  private cartService = inject(CarrinhoService);
  private authService = inject(AuthService);

  cartItems = this.cartService.cartItems;
  cartTotal = this.cartService.cartTotal;

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  aumentarQuantidade(produtoId: string): void {
    const item = this.cartItems().find(i => i.produto.id === produtoId);
    if (item) {
      this.cartService.updateQuantidade(produtoId, item.quantidade + 1);
    }
  }

  diminuirQuantidade(produtoId: string): void {
    const item = this.cartItems().find(i => i.produto.id === produtoId);
    if (item && item.quantidade > 1) {
      this.cartService.updateQuantidade(produtoId, item.quantidade - 1);
    }
  }

  removerItem(produtoId: string): void {
    this.cartService.removeFromCart(produtoId);
  }
}
