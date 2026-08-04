// shared/services/perfil.service.ts
import { Injectable, inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private api = inject(ApiService);

  atualizar(id: string, data: { nome: string; email: string }): Observable<any> {
    return this.api.put(`Usuarios/${id}`, data);
  }
}
