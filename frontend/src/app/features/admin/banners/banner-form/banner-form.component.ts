// features/admin/banners/banner-form/banner-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { BannerService } from '../../../../shared/services/banner.service';
import { UploadService } from '../../../../shared/services/upload.service';
import { Banner } from '../../../../shared/models/banner';

@Component({
  selector: 'app-banner-form',
  standalone: true,
  imports: [
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSlideToggleModule, FormsModule, RouterModule
  ],
  templateUrl: './banner-form.component.html',
  styleUrl: './banner-form.component.scss'
})
export class BannerFormComponent implements OnInit {
  private bannerService = inject(BannerService);
  private uploadService = inject(UploadService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = false;
  bannerId: string | null = null;
  uploading = false;

  banner: Banner = {
    id: '', titulo: '', subtitulo: null, imagemUrl: '',
    link: null, textoBotao: null, ordemExibicao: 1, ativo: true
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.bannerId = id;
      this.bannerService.getById(id).subscribe(b => this.banner = b);
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
        },
        error: () => this.uploading = false
      });
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.isEdit && this.bannerId) {
      this.bannerService.update(this.bannerId, this.banner).subscribe(() => {
        this.router.navigate(['/admin/banners']);
      });
    } else {
      this.bannerService.create(this.banner).subscribe(() => {
        this.router.navigate(['/admin/banners']);
      });
    }
  }
}
