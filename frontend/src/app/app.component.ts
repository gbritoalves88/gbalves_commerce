import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ConfigService } from './shared/services/config.service';
import { Title, Meta } from '@angular/platform-browser';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastComponent } from './shared/toast/toast.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastComponent, MatIconModule, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private configService = inject(ConfigService);
  private title = inject(Title);
  private meta = inject(Meta);

  cookiesAceitos = localStorage.getItem('cookies') === 'aceito';

  isLoginPage = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.router.url === '/login' || this.router.url.startsWith('/admin'))
    ),
    { initialValue: false }
  );

  ngOnInit(): void {
    this.configService.loadConfig().subscribe(config => {
      document.documentElement.style.setProperty('--cor-primaria', config.corPrimaria);
      document.documentElement.style.setProperty('--cor-secundaria', config.corSecundaria);

      if (config.seoTitulo) this.title.setTitle(config.seoTitulo);
      if (config.seoDescricao) this.meta.updateTag({ name: 'description', content: config.seoDescricao });
       if (config.favicon) {
          const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
          if (link) link.href = config.favicon;
        }

    });
  }

  aceitarCookies(): void {
    localStorage.setItem('cookies', 'aceito');
    this.cookiesAceitos = true;
  }

  recusarCookies(): void {
    localStorage.setItem('cookies', 'recusado');
    this.cookiesAceitos = true; // esconde o banner mesmo recusando
  }
}
