// shared/services/category.service.ts
import { Injectable, signal } from '@angular/core';
import { Category } from '../models/category';
import { MOCK_CATEGORIES } from '../models/mock-data';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categories = signal<Category[]>(this.loadCategories());

  private loadCategories(): Category[] {
    const saved = localStorage.getItem('admin_categories');
    return saved ? JSON.parse(saved) : [...MOCK_CATEGORIES];
  }

  private saveCategories(categories: Category[]): void {
    localStorage.setItem('admin_categories', JSON.stringify(categories));
    this.categories.set(categories);
  }

  getAll(): Category[] {
    return this.categories();
  }

  getById(id: number): Category | undefined {
    return this.categories().find(c => c.id === id);
  }

  create(category: Category): void {
    const categories = this.categories();
    category.id = Date.now();
    categories.push(category);
    this.saveCategories(categories);
  }

  update(id: number, data: Category): void {
    const categories = this.categories();
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...data };
      this.saveCategories(categories);
    }
  }

  delete(id: number): void {
    const categories = this.categories().filter(c => c.id !== id);
    this.saveCategories(categories);
  }
}
