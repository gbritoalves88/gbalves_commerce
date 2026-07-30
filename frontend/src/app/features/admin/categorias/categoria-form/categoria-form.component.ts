// features/admin/categorias/categoria-form/categoria-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../../../shared/services/categoria.service';
import { UploadService } from '../../../../shared/services/upload.service';
import { Categoria } from '../../../../shared/models/categoria';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, FormsModule, RouterModule
  ],
  templateUrl: './categoria-form.component.html',
  styleUrl: './categoria-form.component.scss'
})

export class CategoriaFormComponent implements OnInit {
  private categoriaService = inject(CategoriaService);
  private uploadService = inject(UploadService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = false;
  categoriaId: string | null = null;
  uploading = false;

  categoria: Categoria = {
    id: '', nome: '', slug: '', imagemUrl: null,
    ordemExibicao: 0, ativo: true, totalProdutos: 0
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.categoriaId = id;
      this.categoriaService.getById(id).subscribe(c => {
        if (c) this.categoria = c;
      });
    }
  }

  generateSlug(): void {
    this.categoria.slug = this.categoria.nome
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  uploadImagem(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.uploading = true;
    const reader = new FileReader();
    reader.onload = () => {
      this.uploadService.upload(reader.result as string).subscribe({
        next: (res) => {
          this.categoria.imagemUrl = res.url;
          this.uploading = false;
        },
        error: () => this.uploading = false
      });
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.isEdit && this.categoriaId) {
      this.categoriaService.update(this.categoriaId, this.categoria).subscribe(() => {
        this.router.navigate(['/admin/categorias']);
      });
    } else {
      this.categoriaService.create(this.categoria).subscribe(() => {
        this.router.navigate(['/admin/categorias']);
      });
    }
  }
}
