// shared/services/frete.service.ts
import { Injectable, inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs';

export interface FreteResponse {
  id: string;
  nome: string;
  transportadora: string;
  valor: number;
  prazoEntrega: number;
}

export interface CalcularFreteRequest {
  cepDestino: string;
  itens: { produtoId: string; quantidade: number }[];
}

@Injectable({ providedIn: 'root' })
export class FreteService {
  private api = inject(ApiService);

  calcular(request: CalcularFreteRequest): Observable<FreteResponse[]> {
    return this.api.post<FreteResponse[]>('Frete/calcular', request);
  }
}
