// features/produtos/produto-lista/produto-lista.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import { ProdutoCarrinhoComponent } from '../../../shared/produto-card/produto-card.component';
import { ProdutoService } from '../../../shared/services/produto.service';
import { Produto } from '../../../shared/models/produto';
import { CategoriaService } from '../../../shared/services/categoria.service';
import { Categoria } from '../../../shared/models/categoria';

@Component({
  selector: 'app-produto-lista',
  standalone: true,
  imports: [MatIconModule, RouterModule, ProdutoCarrinhoComponent, TitleCasePipe],
  templateUrl: './produto-lista.component.html',
  styleUrl: './produto-lista.component.scss'
})
export class ProdutoListaComponent implements OnInit {
  private productService = inject(ProdutoService);
  private categoryService = inject(CategoriaService);
  private route = inject(ActivatedRoute);

  produtos = signal<Produto[]>([]);
  categories = signal<Categoria[]>([]);
  selectedCategory: string | null = null;

  ngOnInit(): void {
    this.categoryService.loadAll().subscribe(c => this.categories.set(c));

    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || null;
      this.loadProducts();
    });
  }

  loadProducts(): void {
    if (this.selectedCategory) {
      this.productService.loadByCategory(this.selectedCategory)
        .subscribe(p => this.produtos.set(p));
    } else {
      this.productService.loadAll()
        .subscribe(p => this.produtos.set(p));
    }
  }

  selectCategory(slug: string | null): void {
    this.selectedCategory = slug;
    this.loadProducts();
  }
}
