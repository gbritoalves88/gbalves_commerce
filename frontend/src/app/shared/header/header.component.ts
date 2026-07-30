// shared/header/header.component.ts
import { Component, inject, HostListener, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { CarrinhoService } from '../services/carrinho.service';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '../services/config.service';
import { MenuService, Menu } from '../services/menu.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIconModule, MatButtonModule, MatMenuModule,
    MatDividerModule, RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  menus: Menu[] = [];
  menuOpen = false;
  scrolled = false;

  private router = inject(Router);
  private cartService = inject(CarrinhoService);
  private authService = inject(AuthService);
  private configService = inject(ConfigService);
  private menuService = inject(MenuService);

  ngOnInit(): void {
    this.menuService.carregarMenus().subscribe(menus => {
      this.menus = menus;
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 50;
  }

  navegar(url: string): void {
    this.router.navigateByUrl(url);
  }

  get storeName(): string {
    return this.configService.config()?.nomeLoja || '';
  }

  get storeLogo(): string | null {
    return this.configService.config()?.logo || null;
  }

  get cartItemCount(): number {
    return this.cartService.cartCount();
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get corPrimaria(): string {
    return this.configService.config()?.corPrimaria || '#1a237e';
  }

  logout(): void {
    this.authService.logout();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
