// features/admin/produtos/produto-form/produto-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../../../../shared/services/produto.service';
import { CategoriaService } from '../../../../shared/services/categoria.service';
import { UploadService } from '../../../../shared/services/upload.service';
import { Produto } from '../../../../shared/models/produto';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [
    MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatSlideToggleModule, FormsModule, RouterModule
  ],
  templateUrl: './produto-form.component.html',
  styleUrl: './produto-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  private productService = inject(ProdutoService);
  private categoryService = inject(CategoriaService);
  private uploadService = inject(UploadService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categories = this.categoryService.categories;
  isEdit = false;
  productId: string | null = null;
  uploading = false;

  product: Produto = {
    id: '', nome: '', slug: '', descricao: '', preco: 0,
    precoOriginal: null, imagemUrl: '', estoque: 0,
    destaque: false, ativo: true,
    categoriaId: null,
    categoriaNome: null,
    criadoEm: ''
  };

  ngOnInit(): void {
    this.categoryService.loadAll().subscribe();
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.productId = id;
      this.productService.getById(id).subscribe(p => this.product = p);
    }
  }

  generateSlug(): void {
    this.product.slug = this.product.nome
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  uploadImagem(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    this.uploading = true;
    const reader = new FileReader();
    reader.onload = () => {
      this.uploadService.upload(reader.result as string).subscribe({
        next: (res) => {
          this.product.imagemUrl = res.url;
          this.uploading = false;
        },
        error: () => this.uploading = false
      });
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.isEdit && this.productId) {
      this.productService.update(this.productId, this.product).subscribe(() => {
        this.router.navigate(['/admin/produtos']);
      });
    } else {
      this.productService.create(this.product).subscribe(() => {
        this.router.navigate(['/admin/produtos']);
      });
    }
  }
}
