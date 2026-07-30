// features/admin/pedidos/pedido-detalhes/pedido-detalhes.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PedidoService } from '../../../../shared/services/pedido.service';
import { PedidoResponse } from '../../../../shared/models/pedido';

@Component({
  selector: 'app-pedido-detalhes',
  standalone: true,
  imports: [
    MatIconModule, MatButtonModule, MatSelectModule,
    MatFormFieldModule, FormsModule, DatePipe, RouterModule
  ],
  templateUrl: './pedido-detalhes.component.html',
  styleUrl: './pedido-detalhes.component.scss'
})
export class OrderDetailComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private route = inject(ActivatedRoute);

  pedido: PedidoResponse | undefined;
  statusList = ['Pendente', 'Pago', 'Enviado', 'Entregue', 'Cancelado'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pedidoService.obterPorId(id).subscribe(p => this.pedido = p);
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'Pendente': 'Pendente',
      'Pago': 'Pago',
      'Enviado': 'Enviado',
      'Entregue': 'Entregue',
      'Cancelado': 'Cancelado'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'Pendente': '#ff9800',
      'Pago': '#4caf50',
      'Enviado': '#2196f3',
      'Entregue': '#9c27b0',
      'Cancelado': '#f44336'
    };
    return colors[status] || '#999';
  }

  atualizarStatus(novoStatus: string): void {
    if (this.pedido) {
      this.pedidoService.atualizarStatus(this.pedido.id, novoStatus).subscribe(() => {
        this.pedido!.status = novoStatus;
      });
    }
  }
}
