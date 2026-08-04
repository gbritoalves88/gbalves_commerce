// features/perfil/meus-pedidos/meus-pedidos.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { PedidoService, PedidoResumo } from '../../../shared/services/pedido.service';

@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [MatIconModule, RouterModule, DatePipe],
  templateUrl: './meus-pedidos.component.html',
  styleUrl: './meus-pedidos.component.scss'
})
export class MeusPedidosComponent implements OnInit {
  private pedidoService = inject(PedidoService);

  pedidos = signal<PedidoResumo[]>([]);
  loading = true;

  ngOnInit(): void {
    this.pedidoService.meusPedidos().subscribe({
      next: (p) => { this.pedidos.set(p); this.loading = false; },
      error: () => this.loading = false
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'Pendente': 'Pendente', 'Pending': 'Pendente',
      'Pago': 'Pago', 'Paid': 'Pago',
      'Enviado': 'Enviado', 'Shipped': 'Enviado',
      'Entregue': 'Entregue', 'Delivered': 'Entregue',
      'Cancelado': 'Cancelado', 'Cancelled': 'Cancelado'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'Pendente': '#ff9800', 'Pending': '#ff9800',
      'Pago': '#4caf50', 'Paid': '#4caf50',
      'Enviado': '#2196f3', 'Shipped': '#2196f3',
      'Entregue': '#9c27b0', 'Delivered': '#9c27b0',
      'Cancelado': '#f44336', 'Cancelled': '#f44336'
    };
    return colors[status] || '#999';
  }
}
