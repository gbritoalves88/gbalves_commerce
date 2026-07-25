// shared/services/product.service.ts
import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product';
import { MOCK_PRODUCTS } from '../models/mock-data';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  products = signal<Product[]>(this.loadProducts());

  private loadProducts(): Product[] {
    const saved = localStorage.getItem('admin_products');
    return saved ? JSON.parse(saved) : [...MOCK_PRODUCTS];
  }

  private saveProducts(products: Product[]): void {
    localStorage.setItem('admin_products', JSON.stringify(products));
    this.products.set(products);
  }

  getAll(): Product[] {
    return this.products();
  }

  getById(id: number): Product | undefined {
    return this.products().find(p => p.id === id);
  }

  create(product: Product): void {
    const products = this.products();
    product.id = Date.now();
    product.createdAt = new Date();
    products.unshift(product);
    this.saveProducts(products);
  }

  update(id: number, data: Product): void {
    const products = this.products();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...data };
      this.saveProducts(products);
    }
  }

  delete(id: number): void {
    const products = this.products().filter(p => p.id !== id);
    this.saveProducts(products);
  }
}
