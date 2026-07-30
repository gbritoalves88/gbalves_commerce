// features/admin/configuracoes/configuracoes.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../../shared/services/config.service';
import { UploadService } from '../../../shared/services/upload.service';
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
    seoTitulo: null,
    seoDescricao: null
  };

  mensagem = '';
  uploading = false;

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
        },
        error: () => this.uploading = false
      });
    };
    reader.readAsDataURL(file);
  }

  salvar(): void {
    this.configService.atualizar(this.config).subscribe({
      next: () => {
        this.mensagem = 'Configurações salvas com sucesso!';
        setTimeout(() => this.mensagem = '', 3000);
      },
      error: () => {
        this.mensagem = 'Erro ao salvar. Tente novamente.';
      }
    });
  }
}
