// shared/services/cep.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnderecoCep } from '../models/endereco';

@Injectable({ providedIn: 'root' })
export class CepService {
  private baseUrl = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  buscarCep(cep: string): Observable<EnderecoCep> {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      throw new Error('CEP inválido! Deve ter 8 dígitos.');
    }

    return this.http.get<EnderecoCep>(`${this.baseUrl}/${cepLimpo}/json/`).pipe(
      map(data => {
        if (data.erro) {
          throw new Error('CEP não encontrado!');
        }
        return data;
      })
    );
  }
}
