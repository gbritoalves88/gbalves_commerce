// shared/services/dashboard.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Dashboard } from '../models/dashboard';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private api = inject(ApiService);
  dados = signal<Dashboard | null>(null);

  obterResumo(): Observable<Dashboard> {
    return this.api.get<Dashboard>('Dashboard').pipe(
      tap(d => this.dados.set(d))
    );
  }
}
