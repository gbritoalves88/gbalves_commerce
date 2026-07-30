// shared/services/banner.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Observable, tap } from 'rxjs';
import { Banner } from '../models/banner';


@Injectable({ providedIn: 'root' })
export class BannerService {

  private api = inject(ApiService);
  banners = signal<Banner[]>([]);

  loadBanners(): Observable<Banner[]> {
    return this.api.get<Banner[]>('Banners/ativos').pipe(
      tap(banners => this.banners.set(banners))
    );
  }

  loadAll(): Observable<Banner[]> {
    return this.api.get<Banner[]>('Banners').pipe(
      tap(b => this.banners.set(b))
    );
  }

  getById(id: string): Observable<Banner> {
    return this.api.get<Banner>(`Banners/${id}`);
  }

  create(data: any): Observable<Banner> {
    return this.api.post<Banner>('Banners', data);
  }

  update(id: string, data: any): Observable<Banner> {
    return this.api.put<Banner>(`Banners/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`Banners/${id}`);
  }
}
