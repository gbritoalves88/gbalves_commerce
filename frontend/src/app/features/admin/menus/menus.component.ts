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
import { CategoriaService } from '../../../shared/services/categoria.service';
import { AlertService } from '../../../shared/services/alert.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatTableModule,
    MatTooltipModule,
    FormsModule, RouterModule
  ],
  templateUrl: './menus.component.html',
  styleUrl: './menus.component.scss'
})
export class MenusComponent implements OnInit {
  private menuService = inject(MenuService);
  private categoriaService = inject(CategoriaService);
  private alertService = inject(AlertService);

  menus = this.menuService.menus;
  itens = this.menuService.itens;
  categorias = this.categoriaService.categories;
  displayedColumns = ['nome', 'slug', 'ordemExibicao', 'actions'];

  menuSelecionadoId: string | null = null;

  novoMenu = { nome: '', localizacao: 'header' };

  novoItem = {
    nome: '',
    categoriaId: null as string | null,
    ordemExibicao: 1
  };

  ngOnInit(): void {
    this.menuService.carregarMenus().subscribe();
    this.categoriaService.loadAll().subscribe();
  }

  salvarMenu(): void {
    if (!this.novoMenu.nome) return;
    this.menuService.salvarMenu(this.novoMenu.nome, this.novoMenu.localizacao).subscribe({
      next: () => {
        this.alertService.success('Menu criado!');
        this.novoMenu = { nome: '', localizacao: 'header' };
        this.menuService.carregarMenus().subscribe();
      },
      error: () => this.alertService.error('Erro ao criar menu')
    });
  }

  selecionarMenu(menuId: string): void {
    this.menuSelecionadoId = menuId;
    this.menuService.carregarItens(menuId).subscribe();
  }

  salvarItem(): void {
    if (!this.novoItem.nome || !this.menuSelecionadoId) return;

    const cat = this.categorias().find(c => c.id === this.novoItem.categoriaId);
    const slug = cat ? cat.slug : this.novoItem.nome.toLowerCase().replace(/\s+/g, '-');
    const url = cat ? `/produtos?categoria=${cat.slug}` : '/produtos';

    this.menuService.salvarItem(this.menuSelecionadoId, {
      nome: this.novoItem.nome,
      slug: slug,
      url: url,
      ordemExibicao: this.novoItem.ordemExibicao,
      categoriaId: this.novoItem.categoriaId
    }).subscribe({
      next: () => {
        this.alertService.success('Item adicionado!');
        this.novoItem = { nome: '', categoriaId: null, ordemExibicao: 1 };
        this.menuService.carregarItens(this.menuSelecionadoId!).subscribe();
      },
      error: () => this.alertService.error('Erro ao adicionar item')
    });
  }

  removerItem(id: string): void {
    if (confirm('Remover este item?')) {
      this.menuService.removerItem(id).subscribe({
        next: () => {
          this.alertService.success('Item removido!');
          if (this.menuSelecionadoId) {
            this.menuService.carregarItens(this.menuSelecionadoId).subscribe();
          }
        },
        error: () => this.alertService.error('Erro ao remover item')
      });
    }
  }

  toggleItem(itemId: string): void {
    this.menuService.toggleItem(itemId).subscribe({
      next: () => {
        if (this.menuSelecionadoId) {
          this.menuService.carregarItens(this.menuSelecionadoId).subscribe();
        }
      },
      error: () => this.alertService.error('Erro ao alterar status')
    });
  }

  toggleMenu(menuId: string): void {
    this.menuService.toggleMenu(menuId).subscribe({
      next: () => this.menuService.carregarMenus().subscribe(),
      error: () => this.alertService.error('Erro ao alterar status')
    });
  }
}
