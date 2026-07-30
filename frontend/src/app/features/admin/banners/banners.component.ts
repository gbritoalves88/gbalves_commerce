// features/admin/banners/banners.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { BannerService } from '../../../shared/services/banner.service';

@Component({
  selector: 'app-banners',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTableModule, RouterModule],
  templateUrl: './banners.component.html',
  styleUrl: './banners.component.scss'
})
export class BannersComponent implements OnInit {
  private bannerService = inject(BannerService);
  banners = this.bannerService.banners;
  displayedColumns = ['imagemUrl', 'titulo', 'ordemExibicao', 'ativo', 'actions'];

  ngOnInit(): void {
    this.bannerService.loadBanners().subscribe();
  }

  deleteBanner(id: string): void {
    if (confirm('Excluir este banner?')) {
      this.bannerService.delete(id).subscribe(() => {
        this.bannerService.loadBanners().subscribe();
      });
    }
  }
}
