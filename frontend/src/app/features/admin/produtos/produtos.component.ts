// features/admin/produtos/produtos.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ProdutoService } from '../../../shared/services/produto.service';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTableModule, RouterModule],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss'
})
export class ProdutosComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  private alertService = inject(AlertService);
  products = this.produtoService.produtos;
  displayedColumns = ['imagemUrl', 'nome', 'preco', 'estoque', 'categoriaNome', 'actions'];

  ngOnInit(): void {
    this.produtoService.loadAllAdmin().subscribe();
  }

  deleteProduto(id: string, nome: string): void {
    if (confirm(`Excluir "${nome}"?`)) {
      this.produtoService.delete(id).subscribe({
        next: () => {
          this.alertService.success('Produto excluído!');
          this.produtoService.loadAll().subscribe();
        },
        error: () => this.alertService.error('Erro ao excluir produto')
      });
    }
  }
}
