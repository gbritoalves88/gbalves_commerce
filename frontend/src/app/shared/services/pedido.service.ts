// shared/services/pedido.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CriarPedidoRequest, PedidoResponse, PedidoResumo } from '../models/pedido';
import { Observable, tap } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class PedidoService {
  private api = inject(ApiService);

  pedidos = signal<PedidoResponse[]>([]);

  loadAll(): Observable<PedidoResponse[]> {
    return this.api.get<PedidoResponse[]>('Pedidos').pipe(
      tap(p => this.pedidos.set(p))
    );
  }

  criar(data: CriarPedidoRequest): Observable<PedidoResponse> {
    return this.api.post<PedidoResponse>('Pedidos', data);
  }

  obterPorId(id: string): Observable<PedidoResponse> {
    return this.api.get<PedidoResponse>(`Pedidos/${id}`);
  }

  atualizarStatus(id: string, status: string): Observable<void> {
    return this.api.patch(`Pedidos/${id}/status`, `"${status}"`);
  }

  meusPedidos(): Observable<PedidoResumo[]> {
    return this.api.get<PedidoResumo[]>('Pedidos/meus');
  }

  cancelarPedido(id: string): Observable<any> {
    return this.api.post(`Pedidos/${id}/cancelar`, {});
  }

  verificarPagamento(id: string): Observable<any> {
    return this.api.get<any>(`Pedidos/${id}/verificar-pagamento`);
  }

  confirmarPagamento(id: string): Observable<any> {
    return this.api.post('Webhook/pagamento', { id, topic: 'payment' });
  }

  salvarRastreio(id: string, codigoRastreio: string): Observable<any> {
    return this.api.put(`Pedidos/${id}/rastreio`, { codigoRastreio });
  }
}
