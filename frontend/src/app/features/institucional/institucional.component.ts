// features/institucional/institucional.component.ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ConfigService } from '../../shared/services/config.service';

@Component({
  selector: 'app-institucional',
  standalone: true,
  imports: [MatIconModule, RouterModule],
  templateUrl: './institucional.component.html',
  styleUrl: './institucional.component.scss'
})
export class InstitucionalComponent {
  private route = inject(ActivatedRoute);
  private configService = inject(ConfigService);
  pagina: string = '';

  constructor() {
    this.pagina = this.route.snapshot.paramMap.get('pagina') || '';
  }

  get titulo(): string {
    const titulos: Record<string, string> = {
      'privacidade': 'Política de Privacidade',
      'trocas': 'Trocas e Devoluções',
      'contato': 'Fale Conosco'
    };
    return titulos[this.pagina] || 'Página';
  }

  get whatsapp(): string | null {
    return this.configService.config()?.whatsapp || null;
  }

  get email(): string | null {
    return this.configService.config()?.email || null;
  }

  get telefone(): string | null {
    return this.configService.config()?.telefone || null;
  }
}
