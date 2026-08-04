// shared/services/auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/auth';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  isAuthenticated = signal<boolean>(this.checkAuth());
  currentUser = signal<LoginResponse | null>(this.getUser());

  login(email: string, password: string): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('Auth/login', {
      email,
      senha: password
    } as LoginRequest).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response));
        this.isAuthenticated.set(true);
        this.currentUser.set(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAdmin(): boolean {
    return this.currentUser()?.nivelAcesso === 'admin';
  }

  private checkAuth(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  private getUser(): LoginResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserId(): string | null {
    return this.currentUser()?.id || null;
  }
}
