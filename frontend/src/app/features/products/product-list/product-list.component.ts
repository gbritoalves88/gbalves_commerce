// features/products/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../../../shared/models/mock-data';
import { Product } from '../../../shared/models/product';
import { ProductCardComponent } from '../../../shared/product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [MatIconModule, RouterModule, ProductCardComponent, TitleCasePipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  allProducts = MOCK_PRODUCTS;
  products: Product[] = [];
  categories = MOCK_CATEGORIES;
  selectedCategory: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || null;
      this.filterProducts();
    });
  }

  filterProducts(): void {
    if (this.selectedCategory) {
      this.products = this.allProducts.filter(
        p => p.category === this.selectedCategory
      );
    } else {
      this.products = [...this.allProducts];
    }
  }

  selectCategory(slug: string | null): void {
    this.selectedCategory = slug;
    this.filterProducts();
  }
}
