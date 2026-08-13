// features/admin/admin-layout/admin-layout.component.ts
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterModule, RouterOutlet, MatIconModule, MatButtonModule
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  menuAberto = false;

  constructor(public authService: AuthService) {}

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/admin' },
    { label: 'Produtos', icon: 'inventory_2', path: '/admin/produtos' },
    { label: 'Categorias', icon: 'category', path: '/admin/categorias' },
    { label: 'Pedidos', icon: 'receipt_long', path: '/admin/pedidos' },
  ];

  get adminMenuItems() {
    return [
      { label: 'Banners', icon: 'image', path: '/admin/banners' },
      { label: 'Menus', icon: 'menu', path: '/admin/menus' },
      { label: 'Configurações', icon: 'settings', path: '/admin/configuracoes' },
    ];
  }

  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenu(): void {
    this.menuAberto = false;
  }
}
