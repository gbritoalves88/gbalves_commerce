// features/admin/pedidos/pedidos.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { PedidoService } from '../../../shared/services/pedido.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTableModule, RouterModule, DatePipe],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.scss'
})
export class PedidosComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  pedidos = this.pedidoService.pedidos;
  displayedColumns = ['numeroPedido', 'clienteNome', 'total', 'status', 'criadoEm', 'actions'];

  ngOnInit(): void {
    this.pedidoService.loadAll().subscribe();
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'Pending': 'Pendente',
      'Pendente': 'Pendente',
      'Pago': 'Pago',
      'Paid': 'Pago',
      'Enviado': 'Enviado',
      'Shipped': 'Enviado',
      'Entregue': 'Entregue',
      'Delivered': 'Entregue',
      'Cancelado': 'Cancelado',
      'Cancelled': 'Cancelado'
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
}
