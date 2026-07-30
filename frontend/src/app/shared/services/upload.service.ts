// shared/services/upload.service.ts
import { Injectable, inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private api = inject(ApiService);

  upload(base64: string): Observable<{ url: string }> {
    return this.api.post<{ url: string }>('Upload/imagem', { base64 });
  }
}
