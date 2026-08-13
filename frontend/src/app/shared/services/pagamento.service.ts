// shared/services/pagamento.service.ts
import { Injectable, inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CriarCheckoutRequest, CriarCheckoutResponse } from '../models/pagamento';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PagamentoService {
  private api = inject(ApiService);

  criarCheckout(data: CriarCheckoutRequest): Observable<CriarCheckoutResponse> {
    return this.api.post<CriarCheckoutResponse>('Checkout', data);
  }

  confirmarPagamento(pagamentoId: string): Observable<any> {
    return this.api.post('Webhook/pagamento', {
      id: pagamentoId,
      topic: 'payment'
    });
  }
}
