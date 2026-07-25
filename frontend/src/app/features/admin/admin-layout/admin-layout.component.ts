// features/admin/admin-layout/admin-layout.component.ts
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  constructor(public authService: AuthService) {}

  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/admin' },
    { label: 'Produtos', icon: 'inventory_2', path: '/admin/products' },
    { label: 'Categorias', icon: 'category', path: '/admin/categories' },
    { label: 'Pedidos', icon: 'receipt_long', path: '/admin/orders' },
    { label: 'Configurações', icon: 'settings', path: '/admin/settings' },
  ];
}
