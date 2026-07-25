// shared/product-card/product-card.component.ts
import { Component, Input, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Product } from '../models/product';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;
  private cartService = inject(CartService);

  calculateDiscount(): number {
    if (!this.product.originalPrice) return 0;
    const discount = ((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100;
    return Math.round(discount);
  }

  addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(this.product, 1);
  }
}
