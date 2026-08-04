// shared/produto-card/produto-card.component.ts
import { Component, Input, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Produto } from '../models/produto';
import { CarrinhoService } from '../services/carrinho.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-produto-card',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './produto-card.component.html',
  styleUrl: './produto-card.component.scss'
})
export class ProdutoCardComponent {
  @Input() product!: Produto;
  private cartService = inject(CarrinhoService);
  private alertService = inject(AlertService);

  calculateDiscount(): number {
    if (!this.product.precoOriginal) return 0;
    return Math.round(((this.product.precoOriginal - this.product.preco) / this.product.precoOriginal) * 100);
  }

  addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(this.product, 1);
    this.alertService.success(`${this.product.nome} adicionado ao carrinho!`);
  }
}
