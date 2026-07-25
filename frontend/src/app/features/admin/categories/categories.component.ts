// features/admin/categories/categories.component.ts
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CategoryService } from '../../../shared/services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTableModule, RouterModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  private categoryService = inject(CategoryService);
  categories = this.categoryService.categories;
  displayedColumns = ['name', 'slug', 'actions'];

  deleteCategory(id: number, name: string): void {
    if (confirm(`Tem certeza que deseja excluir a categoria "${name}"?`)) {
      this.categoryService.delete(id);
    }
  }
}