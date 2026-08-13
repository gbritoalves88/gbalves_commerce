// features/admin/banners/banner-form/banner-form.component.ts
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { BannerService } from '../../../../shared/services/banner.service';
import { UploadService } from '../../../../shared/services/upload.service';
import { CategoriaService } from '../../../../shared/services/categoria.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { Banner } from '../../../../shared/models/banner';

@Component({
  selector: 'app-banner-form',
  standalone: true,
  imports: [
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatSlideToggleModule,
    FormsModule, RouterModule
  ],
  templateUrl: './banner-form.component.html',
  styleUrl: './banner-form.component.scss'
})
export class BannerFormComponent implements OnInit {
  private bannerService = inject(BannerService);
  private uploadService = inject(UploadService);
  private categoriaService = inject(CategoriaService);
  private alertService = inject(AlertService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  categorias = this.categoriaService.categories;
  isEdit = false;
  bannerId: string | null = null;
  uploading = false;
  categoriaSelecionadaId: string | null = null;
  salvando = false;

  banner: Banner = {
    id: '', titulo: '', subtitulo: null, imagemUrl: '',
    link: null, textoBotao: null, ordemExibicao: 1, ativo: true
  };

  ngOnInit(): void {
    this.categoriaService.loadAll().subscribe();
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.bannerId = id;
      this.bannerService.getById(id).subscribe({
        next: (b) => { this.banner = b; this.cdr.markForCheck(); },
        error: () => this.alertService.error('Erro ao carregar banner')
      });
    }
  }

  onCategoriaChange(categoriaId: string | null): void {
    this.categoriaSelecionadaId = categoriaId;
    if (categoriaId) {
      const cat = this.categorias().find(c => c.id === categoriaId);
      if (cat) {
        this.banner.link = `/produtos?categoria=${cat.slug}`;
      }
    } else {
      this.banner.link = '/produtos';
    }
  }

  uploadImagem(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    this.uploading = true;
    const reader = new FileReader();
    reader.onload = () => {
      this.uploadService.upload(reader.result as string).subscribe({
        next: (res) => {
          this.banner.imagemUrl = res.url;
          this.uploading = false;
          this.cdr.markForCheck();
          this.alertService.success('Imagem enviada!');
        },
        error: () => {
          this.uploading = false;
          this.alertService.error('Erro ao enviar imagem');
        }
      });
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.salvando) return;
    this.salvando = true;

    const request = this.isEdit && this.bannerId
      ? this.bannerService.update(this.bannerId, this.banner)
      : this.bannerService.create(this.banner);

    request.subscribe({
      next: () => {
        this.alertService.success(this.isEdit ? 'Banner atualizado!' : 'Banner criado!');
        this.router.navigate(['/admin/banners']);
      },
      error: () => {
        this.salvando = false;
        this.alertService.error('Erro ao salvar banner');
      }
    });
  }
}
