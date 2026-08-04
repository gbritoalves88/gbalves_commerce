// shared/services/menu.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Observable, tap, switchMap, map } from 'rxjs';

export interface Menu {
  id: string;
  nome: string;
  localizacao: string;
  itens: MenuItem[];
}

export interface MenuItem {
  id: string;
  nome: string;
  slug: string | null;
  url: string | null;
  icone: string | null;
  ordemExibicao: number;
  subItens?: MenuItem[];
}

@Injectable({ providedIn: 'root' })
export class MenuService {
  private api = inject(ApiService);

  menus = signal<Menu[]>([]);
  itens = signal<MenuItem[]>([]);

  // ========== MENUS ==========

  /** Carregar todos os menus cadastrados */
  carregarMenus(): Observable<Menu[]> {
    return this.api.get<Menu[]>('Menus').pipe(
      tap(menus => this.menus.set(menus))
    );
  }

  /** Salvar um novo menu (ex: Vestuário no header) */
  salvarMenu(nome: string, localizacao: string): Observable<Menu> {
    return this.api.post<Menu>('Menus', { nome, localizacao }).pipe(
      tap(() => this.carregarMenus().subscribe())
    );
  }

  // ========== ITENS ==========

  /** Carregar itens de um menu específico */
  carregarItens(menuId: string): Observable<MenuItem[]> {
    return this.api.get<Menu>(`Menus/${menuId}`).pipe(
      tap(menu => this.itens.set(menu.itens)),
      map(menu => menu.itens)
    );
  }

  /** Adicionar item a um menu */
 salvarItem(menuId: string, data: {
  nome: string;
  slug?: string;
  url?: string;
  icone?: string;
  itemPaiId?: string | null;
  ordemExibicao?: number;
  categoriaId?: string | null;  // ← ADICIONAR
}): Observable<MenuItem> {
  return this.api.post<MenuItem>(`Menus/${menuId}/itens`, data).pipe(
    tap(() => this.carregarItens(menuId).subscribe())
  );
}

  /** Remover item */
  removerItem(itemId: string): Observable<void> {
    return this.api.delete<void>(`Menus/itens/${itemId}`);
  }
}
