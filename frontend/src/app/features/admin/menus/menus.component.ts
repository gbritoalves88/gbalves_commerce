// features/admin/menus/menus.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../../shared/services/menu.service';

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatTableModule,
    FormsModule, RouterModule
  ],
  templateUrl: './menus.component.html',
  styleUrl: './menus.component.scss'
})
export class MenusComponent implements OnInit {
  private menuService = inject(MenuService);

  menus = this.menuService.menus;
  itens = this.menuService.itens;
  displayedColumns = ['nome', 'slug', 'ordemExibicao', 'actions'];

  // Menu selecionado para ver seus itens
  menuSelecionadoId: string | null = null;

  // Form para novo menu (pai)
  novoMenu = { nome: '', localizacao: 'header' };

  // Form para novo item (filho)
  novoItem = {
    nome: '',
    slug: '',
    ordemExibicao: 1
  };

  ngOnInit(): void {
    this.menuService.carregarMenus().subscribe();
  }

  // ========== MENU PAI ==========
  salvarMenu(): void {
    if (!this.novoMenu.nome) return;
    this.menuService.salvarMenu(this.novoMenu.nome, this.novoMenu.localizacao).subscribe(() => {
      this.novoMenu = { nome: '', localizacao: 'header' };
    });
  }

  selecionarMenu(menuId: string): void {
    this.menuSelecionadoId = menuId;
    this.menuService.carregarItens(menuId).subscribe();
  }

  // ========== ITEM FILHO ==========
  salvarItem(): void {
    if (!this.novoItem.nome || !this.menuSelecionadoId) return;

    const slug = this.novoItem.slug || this.novoItem.nome.toLowerCase().replace(/\s+/g, '-');
    const url = `/produtos?categoria=${slug}`;

    this.menuService.salvarItem(this.menuSelecionadoId, {
      nome: this.novoItem.nome,
      slug: slug,
      url: url,
      ordemExibicao: this.novoItem.ordemExibicao,
      itemPaiId: null  // ← aqui! null = item principal, ou ID de um item pai
    }).subscribe(() => {
      this.novoItem = { nome: '', slug: '', ordemExibicao: 1 };
    });
  }

  removerItem(id: string): void {
    if (confirm('Remover este item?')) {
      this.menuService.removerItem(id).subscribe(() => {
        if (this.menuSelecionadoId) {
          this.menuService.carregarItens(this.menuSelecionadoId).subscribe();
        }
      });
    }
  }
}
