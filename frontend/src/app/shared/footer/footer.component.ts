// shared/footer/footer.component.ts
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  private configService = inject(ConfigService);

  get storeName(): string {
    return this.configService.config()?.nomeLoja || '';
  }

  get whatsapp(): string | null {
    return this.configService.config()?.whatsapp || null;
  }

  get instagram(): string | null {
    return this.configService.config()?.instagram || null;
  }


}
