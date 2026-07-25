// features/profile/my-orders/my-orders.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [MatIconModule, RouterModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})
export class MyOrdersComponent {
  orders = [
    { id: 1001, date: '20/07/2026', total: 'R$ 259,90', status: 'Entregue' },
    { id: 1002, date: '21/07/2026', total: 'R$ 89,90', status: 'Enviado' },
  ];

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'Entregue': '#4caf50',
      'Enviado': '#2196f3',
      'Pendente': '#ff9800',
    };
    return colors[status] || '#999';
  }
}
