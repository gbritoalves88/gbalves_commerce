// features/admin/products/products.component.ts
import { Component, inject, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ProductService } from '../../../shared/services/product.service';
import { Product } from '../../../shared/models/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTableModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  private productService = inject(ProductService);
  private router = inject(Router);

  products = this.productService.products;
  displayedColumns = ['image', 'name', 'price', 'stock', 'category', 'actions'];

  deleteProduct(id: number, name: string): void {
    if (confirm(`Tem certeza que deseja excluir "${name}"?`)) {
      this.productService.delete(id);
    }
  }

  getTotalStock(): number {
    return this.products().reduce((sum, p) => sum + p.stock, 0);
  }
}
