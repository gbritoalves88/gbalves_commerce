// features/admin/banners/banners.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { BannerService } from '../../../shared/services/banner.service';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-banners',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTableModule, RouterModule],
  templateUrl: './banners.component.html',
  styleUrl: './banners.component.scss'
})
export class BannersComponent implements OnInit {
  private bannerService = inject(BannerService);
  private alertService = inject(AlertService);
  banners = this.bannerService.banners;
  displayedColumns = ['imagemUrl', 'titulo', 'ordemExibicao', 'ativo', 'actions'];

  ngOnInit(): void {
    this.bannerService.loadAll().subscribe();
  }

  deletarBanner(id: string, titulo: string): void {
    if (confirm(`Excluir o banner "${titulo}"?`)) {
      this.bannerService.delete(id).subscribe({
        next: () => {
          this.alertService.success('Banner excluído com sucesso!');
          this.bannerService.loadAll().subscribe();
        },
        error: () => this.alertService.error('Erro ao excluir banner')
      });
    }
  }
}
