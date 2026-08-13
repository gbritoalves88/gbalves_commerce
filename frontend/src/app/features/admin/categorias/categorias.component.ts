// features/admin/categorias/categorias.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CategoriaService } from '../../../shared/services/categoria.service';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTableModule, RouterModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent implements OnInit {
  private categoriaService = inject(CategoriaService);
  private alertService = inject(AlertService);
  categories = this.categoriaService.categories;
  displayedColumns = ['nome', 'slug', 'actions'];

  ngOnInit(): void {
    this.categoriaService.loadAll().subscribe();
  }

  deleteCategoria(id: string, nome: string): void {
    if (confirm(`Excluir a categoria "${nome}"?`)) {
      this.categoriaService.delete(id).subscribe({
        next: () => {
          this.alertService.success('Categoria excluída com sucesso!');
          this.categoriaService.loadAll().subscribe();
        },
        error: () => this.alertService.error('Erro ao excluir categoria')
      });
    }
  }
}
