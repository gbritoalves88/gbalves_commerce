// features/produtos/produto-lista/produto-lista.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import { ProdutoService } from '../../../shared/services/produto.service';
import { Produto } from '../../../shared/models/produto';
import { CategoriaService } from '../../../shared/services/categoria.service';
import { Categoria } from '../../../shared/models/categoria';
import { ProdutoCardComponent } from '../../../shared/produto-card/produto-card.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-produto-lista',
  standalone: true,
  imports: [MatIconModule, RouterModule, ProdutoCardComponent, TitleCasePipe],
  templateUrl: './produto-lista.component.html',
  styleUrl: './produto-lista.component.scss'
})
export class ProdutoListaComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  private categoriaService = inject(CategoriaService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  produtos = signal<Produto[]>([]);
  categorias = signal<Categoria[]>([]);
  categoriaSelecionada: string | null = null;
  termoBusca: string | null = null;

  ngOnInit(): void {
    this.categoriaService.loadAll().subscribe(c => this.categorias.set(c));
    this.route.queryParams.subscribe(params => {
      this.categoriaSelecionada = params['categoria'] || null;
      this.termoBusca = params['busca'] || null;
      this.carregarProdutos();
    });
  }

  carregarProdutos(): void {
    if (this.termoBusca) {
      this.produtoService.buscar(this.termoBusca).subscribe(p => {
        this.produtos.set(p);
        this.cdr.markForCheck();
      });
    } else if (this.categoriaSelecionada) {
      this.produtoService.loadByCategory(this.categoriaSelecionada).subscribe(p => {
        this.produtos.set(p);
        this.cdr.markForCheck();
      });
    } else {
      this.produtoService.loadAll().subscribe(p => {
        this.produtos.set(p);
        this.cdr.markForCheck();
      });
    }
  }

  selecionarCategoria(slug: string | null): void {
    this.categoriaSelecionada = slug;
    this.carregarProdutos();
  }
}
