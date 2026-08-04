// features/home/home.component.ts
import { Component, AfterViewInit, OnDestroy, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { BannerService } from '../../shared/services/banner.service';
import { ProdutoService } from '../../shared/services/produto.service';
import { ProdutoCardComponent } from '../../shared/produto-card/produto-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, MatIconModule, ProdutoCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit, OnInit {
  private bannerService = inject(BannerService);
  private productService = inject(ProdutoService);
  private router = inject(Router);
  featuredProducts = this.productService.destaques;

  banners = this.bannerService.banners;
  private swiper: Swiper | null = null;

  ngOnInit(): void {
    this.bannerService.loadBanners().subscribe(() => {
      // Inicia Swiper só depois dos banners carregarem
      setTimeout(() => this.initSwiper(), 200);
    });
    this.productService.loadDestaques().subscribe();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initSwiper(), 100);
  }

  ngOnDestroy(): void {
    this.swiper?.destroy();
  }

  private initSwiper(): void {
    this.swiper = new Swiper('.banner-swiper', {
      modules: [Autoplay, Navigation, Pagination],
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      observer: true,
      observeParents: true,
    });
  }

  navegar(url: string): void {
    this.router.navigateByUrl(url);
  }
}
