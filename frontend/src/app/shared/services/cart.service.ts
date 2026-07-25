// shared/services/cart.service.ts
import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'gbalves_cart';
  cartItems = signal<CartItem[]>(this.loadCart());
  cartCount = signal<number>(this.getTotalItems());
  cartTotal = signal<number>(this.getTotal());

  constructor() {}

  private loadCart(): CartItem[] {
    const saved = localStorage.getItem(this.cartKey);
    return saved ? JSON.parse(saved) : [];
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(items));
    this.cartItems.set(items);
    this.cartCount.set(this.getTotalItems());
    this.cartTotal.set(this.getTotal());
  }

  addToCart(product: Product, quantity: number = 1): void {
    const items = this.cartItems();
    const existing = items.find(i => i.product.id === product.id);

    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock);
    } else {
      items.push({ product, quantity });
    }

    this.saveCart(items);
  }

  updateQuantity(productId: number, quantity: number): void {
    const items = this.cartItems();
    const item = items.find(i => i.product.id === productId);

    if (item) {
      item.quantity = Math.max(1, Math.min(quantity, item.product.stock));
      this.saveCart(items);
    }
  }

  removeFromCart(productId: number): void {
    const items = this.cartItems().filter(i => i.product.id !== productId);
    this.saveCart(items);
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getTotalItems(): number {
    return this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotal(): number {
    return this.cartItems().reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }
}
