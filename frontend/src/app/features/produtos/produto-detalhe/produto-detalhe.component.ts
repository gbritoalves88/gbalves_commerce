// features/produtos/produto-detalhe/produto-detalhe.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Produto } from '../../../shared/models/produto';
import { CarrinhoService } from '../../../shared/services/carrinho.service';
import { ProdutoService } from '../../../shared/services/produto.service';
import { inject } from '@angular/core/primitives/di';

@Component({
  selector: 'app-produto-detalhe',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './produto-detalhe.component.html',
  styleUrl: './produto-detalhe.component.scss'
})
export class ProdutoDetalheComponent implements OnInit {
  product: Produto | undefined;
  quantity = 1;
  private productService = inject(ProdutoService);

  constructor(
    private route: ActivatedRoute,
    private carrinhoService: CarrinhoService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.productService.getBySlug(slug).subscribe(p => this.product = p);
    }
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.estoque) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;
    this.carrinhoService.addToCart(this.product, this.quantity);
    // Feedback simples
    alert(`${this.quantity}x ${this.product.nome} adicionado ao carrinho!`);
  }

  calculateDiscount(): number {
    if (!this.product?.precoOriginal) return 0;
    return Math.round(
      ((this.product.precoOriginal - this.product.preco) / this.product.precoOriginal) * 100
    );
  }
}
