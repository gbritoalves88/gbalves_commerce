// features/produtos/produto-detalhe/produto-detalhe.component.ts
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Produto } from '../../../shared/models/produto';
import { CarrinhoService } from '../../../shared/services/carrinho.service';
import { ProdutoService } from '../../../shared/services/produto.service';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-produto-detalhe',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './produto-detalhe.component.html',
  styleUrl: './produto-detalhe.component.scss'
})
export class ProdutoDetalheComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private carrinhoService = inject(CarrinhoService);
  private produtoService = inject(ProdutoService);
  private alertService = inject(AlertService);
  private cdr = inject(ChangeDetectorRef);

  produto: Produto | undefined;
  quantidade = 1;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.produtoService.getBySlug(slug).subscribe(p => {
        this.produto = p;
        this.cdr.markForCheck();
      });
    }
  }

  aumentarQuantidade(): void {
    if (this.produto && this.quantidade < this.produto.estoque) {
      this.quantidade++;
    }
  }

  diminuirQuantidade(): void {
    if (this.quantidade > 1) {
      this.quantidade--;
    }
  }

  adicionarAoCarrinho(): void {
    if (!this.produto) return;
    this.carrinhoService.addToCart(this.produto, this.quantidade);
    this.alertService.success(`${this.quantidade}x ${this.produto.nome} adicionado ao carrinho!`);
  }

  calcularDesconto(): number {
    if (!this.produto?.precoOriginal) return 0;
    return Math.round(((this.produto.precoOriginal - this.produto.preco) / this.produto.precoOriginal) * 100);
  }
}
