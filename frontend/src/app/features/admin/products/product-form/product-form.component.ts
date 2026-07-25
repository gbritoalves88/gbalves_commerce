// features/admin/products/product-form/product-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../shared/services/product.service';
import { MOCK_CATEGORIES } from '../../../../shared/models/mock-data';
import { Product } from '../../../../shared/models/product';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categories = MOCK_CATEGORIES;
  isEdit = false;
  productId: number | null = null;

  product: Product = {
    id: 0,
    name: '',
    slug: '',
    price: 0,
    image: '',
    category: '',
    description: '',
    stock: 0,
    featured: false,
    createdAt: new Date()
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.productId = Number(id);
      const existing = this.productService.getById(this.productId);
      if (existing) {
        this.product = { ...existing };
      }
    }
  }

  generateSlug(): void {
    this.product.slug = this.product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  onSubmit(): void {
    if (this.isEdit && this.productId) {
      this.productService.update(this.productId, this.product);
    } else {
      this.productService.create(this.product);
    }
    this.router.navigate(['/admin/products']);
  }
}
