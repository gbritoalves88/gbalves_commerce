// features/admin/categories/category-form/category-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../../shared/services/category.service';
import { Category } from '../../../../shared/models/category';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = false;
  categoryId: number | null = null;

  category: Category = {
    id: 0,
    name: '',
    slug: ''
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.categoryId = Number(id);
      const existing = this.categoryService.getById(this.categoryId);
      if (existing) {
        this.category = { ...existing };
      }
    }
  }

  generateSlug(): void {
    this.category.slug = this.category.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  onSubmit(): void {
    if (this.isEdit && this.categoryId) {
      this.categoryService.update(this.categoryId, this.category);
    } else {
      this.categoryService.create(this.category);
    }
    this.router.navigate(['/admin/categories']);
  }
}