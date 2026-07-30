// features/admin/categorias/categorias.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CategoriaService } from '../../../shared/services/categoria.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTableModule, RouterModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent implements OnInit {
  private categoriaService = inject(CategoriaService);
  categories = this.categoriaService.categories;
  displayedColumns = ['nome', 'slug', 'actions'];

  ngOnInit(): void {
    this.categoriaService.loadAll().subscribe();
  }

  deleteCategoria(id: string, nome: string): void {
    if (confirm(`Excluir a categoria "${nome}"?`)) {
      this.categoriaService.delete(id).subscribe(() => {
        this.categoriaService.loadAll().subscribe();
      });
    }
  }
}
