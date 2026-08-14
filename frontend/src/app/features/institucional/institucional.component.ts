import { Component, inject, OnInit } from '@angular/core';
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
export class InstitucionalComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private configService = inject(ConfigService);

  pagina: string = '';

  ngOnInit(): void {
    // Lê o parâmetro inicial
    this.pagina = this.route.snapshot.paramMap.get('pagina') || '';

    // Escuta mudanças de parâmetro (navegação entre páginas)
    this.route.paramMap.subscribe(params => {
      this.pagina = params.get('pagina') || '';
    });
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
