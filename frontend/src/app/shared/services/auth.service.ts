// shared/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = signal<boolean>(this.checkAuth());

  private mockUser = {
    email: 'admin@gbalves.com',
    password: 'admin123'
  };

  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    if (email === this.mockUser.email && password === this.mockUser.password) {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('is_admin', 'true');
      this.isAuthenticated.set(true);
      // Não redireciona mais aqui, deixa o componente decidir
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.isAuthenticated.set(false);
    this.router.navigate(['/admin/login']);
  }

  private checkAuth(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}
