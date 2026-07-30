// shared/services/config.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '../services/api.service';
import { StoreConfig } from '../models/config';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private api = inject(ApiService);
  config = signal<StoreConfig | null>(null);

  loadConfig(): Observable<StoreConfig> {
    return this.api.get<StoreConfig>('configuracao-loja').pipe(
      tap(c => this.config.set(c))
    );
  }

  atualizar(data: StoreConfig): Observable<StoreConfig> {
    return this.api.put<StoreConfig>('configuracao-loja', data).pipe(
      tap(c => this.config.set(c))
    );
  }
}
