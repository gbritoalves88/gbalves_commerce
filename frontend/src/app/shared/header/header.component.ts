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
import { MenuService } from '../services/menu.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Menu } from '../models/menu'
import { ViewEncapsulation } from '@angular/core';
import { ViewChild, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIconModule, MatButtonModule, MatMenuModule,
    MatDividerModule, RouterModule,  FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  menus: Menu[] = [];
  menuOpen = false;
  scrolled = false;
  termoBusca = '';
  hoverMenuId: string | null = null;
  openSubmenus: Set<string> = new Set();
  private closeTimeout: any;
  private router = inject(Router);
  private cartService = inject(CarrinhoService);
  private authService = inject(AuthService);
  private configService = inject(ConfigService);
  private menuService = inject(MenuService);
  @ViewChildren(MatMenuTrigger) menuTriggers!: QueryList<MatMenuTrigger>;

  ngOnInit(): void {
    this.menuService.carregarMenus().subscribe(menus => {
      this.menus = menus
        .filter(m => m.ativo && m.localizacao === 'header')
        .map(m => ({
          ...m,
          itens: m.itens.filter(i => i.ativo)
        }));
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 50;

    // Fecha todos os submenus abertos quando scroll acontece
    this.menuTriggers?.forEach(trigger => {
      if (trigger.menuOpen) {
        trigger.closeMenu();
      }
    });
  }

  buscar(): void {
    const termo = this.termoBusca.trim();
    if (termo) {
      this.router.navigate(['/produtos'], { queryParams: { busca: termo } });
      this.termoBusca = '';
    }
  }

  toggleSubmenu(menuId: string): void {
    if (this.openSubmenus.has(menuId)) {
      this.openSubmenus.delete(menuId);
    } else {
      this.openSubmenus.add(menuId);
    }
  }

  isSubmenuOpen(menuId: string): boolean {
    return this.openSubmenus.has(menuId);
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


  openMenu(trigger: MatMenuTrigger): void {
    trigger.openMenu();
  }


  closeMenu(): void {
    this.menuOpen = false;
  }

  onMenuLeave(trigger: MatMenuTrigger): void {
    this.closeTimeout = setTimeout(() => trigger.closeMenu(), 200);
  }

  onMenuEnter(trigger: MatMenuTrigger): void {
    clearTimeout(this.closeTimeout);
    trigger.openMenu();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get isOperador(): boolean {
    return this.authService.isOperador();
  }

  navegar(url: string): void {
    this.router.navigateByUrl(url);
  }

  isActive(url: string): boolean {
    return this.router.url === url || this.router.url.startsWith(url + '/');
  }


}
