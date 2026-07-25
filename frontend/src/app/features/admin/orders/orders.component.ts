// features/admin/orders/orders.component.ts
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { OrderService, Order } from '../../../shared/services/order.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTableModule, RouterModule, DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  private orderService = inject(OrderService);
  orders = this.orderService.orders;
  displayedColumns = ['id', 'customer', 'total', 'status', 'date', 'actions'];

  getStatusLabel(status: Order['status']): string {
    const labels: Record<string, string> = {
      'pending': 'Pendente',
      'paid': 'Pago',
      'shipped': 'Enviado',
      'delivered': 'Entregue',
      'cancelled': 'Cancelado'
    };
    return labels[status] || status;
  }

  getStatusColor(status: Order['status']): string {
    const colors: Record<string, string> = {
      'pending': '#ff9800',
      'paid': '#4caf50',
      'shipped': '#2196f3',
      'delivered': '#9c27b0',
      'cancelled': '#f44336'
    };
    return colors[status] || '#999';
  }
}