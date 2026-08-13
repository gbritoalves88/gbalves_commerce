import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Obter token
  const token = authService.getToken();

  // Se tem token, adiciona no header
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Processar requisição
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Tratar 401 (não autorizado)
      if (error.status === 401) {
        console.warn('⚠️ Sessão expirada! Redirecionando para login...');

        // Limpar dados da sessão
        authService.logout();

        // Redirecionar para login (se não estiver na página de login)
        if (!router.url.includes('/login')) {
          router.navigate(['/login']);
        }
      }

      return throwError(() => error);
    })
  );
};
