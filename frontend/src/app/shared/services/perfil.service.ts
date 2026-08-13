// shared/services/perfil.service.ts
import { Injectable, inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Observable, tap } from 'rxjs';

export interface AtualizarPerfilRequest {
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
}

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private api = inject(ApiService);

  atualizar(id: string, data: AtualizarPerfilRequest): Observable<any> {
    return this.api.put(`Usuarios/${id}`, data);
  }
}
