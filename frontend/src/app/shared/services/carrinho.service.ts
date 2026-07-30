// shared/services/carrinho.service.ts
import { Injectable, signal } from '@angular/core';
import { Produto } from '../models/produto';
import { CarrinhoItem } from '../models/carrinho';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private cartKey = 'gbalves_cart';
  cartItems = signal<CarrinhoItem[]>(this.loadCart());
  cartCount = signal<number>(this.getTotalItems());
  cartTotal = signal<number>(this.getTotal());

  private loadCart(): CarrinhoItem[] {
    try {
      const saved = localStorage.getItem(this.cartKey);
      if (!saved) return [];
      const data = JSON.parse(saved);
      // Verifica se é dados novos (produto.preco) ou antigos (product.price)
      if (data.length > 0 && data[0].product) {
        // Dados antigos - limpa
        localStorage.removeItem(this.cartKey);
        return [];
      }
      return data;
    } catch {
      localStorage.removeItem(this.cartKey);
      return [];
    }
  }

  private saveCart(items: CarrinhoItem[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(items));
    this.cartItems.set(items);
    this.cartCount.set(this.getTotalItems());
    this.cartTotal.set(this.getTotal());
  }

  addToCart(produto: Produto, quantidade: number = 1): void {
    const items = this.cartItems();
    const existing = items.find(i => i.produto.id === produto.id);

    if (existing) {
      existing.quantidade = Math.min(existing.quantidade + quantidade, produto.estoque);
    } else {
      items.push({ produto, quantidade });
    }

    this.saveCart(items);
  }

  updateQuantidade(produtoId: string, quantidade: number): void {
    const items = this.cartItems();
    const item = items.find(i => i.produto.id === produtoId);

    if (item) {
      item.quantidade = Math.max(1, Math.min(quantidade, item.produto.estoque));
      this.saveCart(items);
    }
  }

  removeFromCart(produtoId: string): void {
    const items = this.cartItems().filter(i => i.produto.id !== produtoId);
    this.saveCart(items);
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getTotalItems(): number {
    return this.cartItems().reduce((sum, item) => sum + item.quantidade, 0);
  }

  getTotal(): number {
    return this.cartItems().reduce((sum, item) => sum + (item.produto.preco * item.quantidade), 0);
  }
}
