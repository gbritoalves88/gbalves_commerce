// shared/services/pedido.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CriarPedidoRequest, PedidoResponse } from '../models/pedido';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private api = inject(ApiService);

  // Admin
  pedidos = signal<PedidoResponse[]>([]);

  loadAll(): Observable<PedidoResponse[]> {
    return this.api.get<PedidoResponse[]>('Pedidos').pipe(
      tap(p => this.pedidos.set(p))
    );
  }

  // Checkout
  criar(data: CriarPedidoRequest): Observable<PedidoResponse> {
    return this.api.post<PedidoResponse>('Pedidos', data);
  }

  // Detalhe
  obterPorId(id: string): Observable<PedidoResponse> {
    return this.api.get<PedidoResponse>(`Pedidos/${id}`);
  }

  // Atualizar status
  atualizarStatus(id: string, status: string): Observable<void> {
    return this.api.patch(`Pedidos/${id}/status`, status);
  }
}
