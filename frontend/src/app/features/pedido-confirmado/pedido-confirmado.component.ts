// features/pedido-confirmado/pedido-confirmado.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PedidoService } from '../../shared/services/pedido.service';
import { PedidoResponse } from '../../shared/models/pedido';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pedido-confirmado',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterModule, DatePipe],
  templateUrl: './pedido-confirmado.component.html',
  styleUrl: './pedido-confirmado.component.scss'
})
export class PedidoConfirmadoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private pedidoService = inject(PedidoService);

  pedidoId: string = '';
  pedido = signal<PedidoResponse | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.pedidoId = this.route.snapshot.paramMap.get('id') || '';
    if (this.pedidoId) {
      this.pedidoService.obterPorId(this.pedidoId).subscribe({
        next: (p) => {
          this.pedido.set(p);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  get formaPagamento(): string {
    const fp = this.pedido()?.formaPagamento;
    if (!fp) return 'Não informado';
    if (fp === 'Pix') return 'Pix';
    if (fp === 'CartaoCredito') return 'Cartão de Crédito';
    return fp;
  }

  get statusPagamento(): string {
    const sp = this.pedido()?.statusPagamento;
    if (!sp) return 'Não informado';
    if (sp === 'Aprovado' || sp === 'Approved') return 'Aprovado ✅';
    if (sp === 'Pendente' || sp === 'Pending') return 'Pendente ⏳';
    return sp;
  }
}
