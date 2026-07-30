// shared/services/category.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Categoria } from '../models/categoria';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private api = inject(ApiService);
  categories = signal<Categoria[]>([]);

  loadAll(): Observable<Categoria[]> {
    return this.api.get<Categoria[]>('Categorias').pipe(
      tap(c => this.categories.set(c))
    );
  }

  getAll(): Categoria[] {
    return this.categories();
  }

  getById(id: string): Observable<Categoria> {
    return this.api.get<Categoria>(`Categorias/${id}`);
  }

  create(data: Partial<Categoria>): Observable<Categoria> {
    return this.api.post<Categoria>('Categorias', data);
  }

  update(id: string, data: Partial<Categoria>): Observable<Categoria> {
    return this.api.put<Categoria>(`Categorias/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`Categorias/${id}`);
  }
}
