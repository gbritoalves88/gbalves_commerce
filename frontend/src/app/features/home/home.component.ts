// features/home/home.component.ts
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { MOCK_BANNERS } from '../../shared/models/mock-banners';
import { MOCK_PRODUCTS } from '../../shared/models/mock-data';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, MatIconModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  banners = MOCK_BANNERS;
  featuredProducts = MOCK_PRODUCTS.filter(p => p.featured);
  private swiper: Swiper | null = null;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initSwiper();
    }, 0);
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
}
