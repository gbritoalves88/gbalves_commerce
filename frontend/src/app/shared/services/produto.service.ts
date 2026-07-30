// shared/services/product.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, tap } from 'rxjs';
import { Produto } from '../models/produto';


@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private api = inject(ApiService);

  produtos = signal<Produto[]>([]);
  destaques = signal<Produto[]>([]);

  loadAll(): Observable<Produto[]> {
    return this.api.get<Produto[]>('Produtos').pipe(
      tap(p => this.produtos.set(p))
    );
  }

  loadDestaques(): Observable<Produto[]> {
    return this.api.get<Produto[]>('Produtos/destaques').pipe(
      tap(p => this.destaques.set(p))
    );
  }

  loadByCategory(slug: string): Observable<Produto[]> {
    return this.api.get<Produto[]>(`Produtos/categoria/${slug}`);
  }

  getBySlug(slug: string): Observable<Produto> {
    return this.api.get<Produto>(`Produtos/${slug}`);
  }

  getById(id: string): Observable<Produto> {
    return this.api.get<Produto>(`Produtos/${id}`);
  }

  create(data: any): Observable<Produto> {
    return this.api.post<Produto>('Produtos', data);
  }

  update(id: string, data: any): Observable<Produto> {
    return this.api.put<Produto>(`Produtos/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`Produtos/${id}`);
  }
}
