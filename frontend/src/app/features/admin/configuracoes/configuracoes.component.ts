// features/admin/configuracoes/configuracoes.component.ts
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../../shared/services/config.service';
import { UploadService } from '../../../shared/services/upload.service';
import { AlertService } from '../../../shared/services/alert.service';
import { StoreConfig } from '../../../shared/models/config';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, FormsModule, RouterModule
  ],
  templateUrl: './configuracoes.component.html',
  styleUrl: './configuracoes.component.scss'
})
export class ConfiguracoesComponent implements OnInit {
  private configService = inject(ConfigService);
  private uploadService = inject(UploadService);
  private alertService = inject(AlertService);
  private cdr = inject(ChangeDetectorRef);

  config: StoreConfig = {
    id: '',
    nomeLoja: '',
    logo: null,
    favicon: null,
    corPrimaria: '#1a237e',
    corSecundaria: '#ff4081',
    whatsapp: null,
    instagram: null,
    facebook: null,
    email: null,
    telefone: null,
    seoTitulo: null,
    seoDescricao: null
  };

  uploading = false;
  uploadingFavicon = false;
  salvando = false;

  ngOnInit(): void {
    const current = this.configService.config();
    if (current) this.config = { ...current };
  }

  uploadLogo(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    this.uploading = true;
    const reader = new FileReader();
    reader.onload = () => {
      this.uploadService.upload(reader.result as string).subscribe({
        next: (res) => {
          this.config.logo = res.url;
          this.uploading = false;
          this.cdr.markForCheck();
          this.alertService.success('Logo enviado!');
        },
        error: () => {
          this.uploading = false;
          this.alertService.error('Erro ao enviar logo');
        }
      });
    };
    reader.readAsDataURL(file);
  }

  uploadFavicon(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    this.uploadingFavicon = true;
    const reader = new FileReader();
    reader.onload = () => {
      this.uploadService.upload(reader.result as string).subscribe({
        next: (res) => {
          this.config.favicon = res.url;
          this.uploadingFavicon = false;
          this.cdr.markForCheck();
          this.alertService.success('Favicon enviado!');
        },
        error: () => {
          this.uploadingFavicon = false;
          this.alertService.error('Erro ao enviar favicon');
        }
      });
    };
    reader.readAsDataURL(file);
  }

  salvar(): void {
    if (this.salvando) return;
    this.salvando = true;
    this.configService.atualizar(this.config).subscribe({
      next: () => {
        this.alertService.success('Configurações salvas!');
        this.salvando = false;
      },
      error: () => {
        this.alertService.error('Erro ao salvar');
        this.salvando = false;
      }
    });
  }
}
