// features/admin/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  stats = [
    { label: 'Pedidos Hoje', value: 12, icon: 'receipt_long', color: '#1a237e' },
    { label: 'Faturamento', value: 'R$ 1.250', icon: 'payments', color: '#4caf50' },
    { label: 'Produtos', value: 48, icon: 'inventory_2', color: '#ff9800' },
    { label: 'Clientes', value: 156, icon: 'people', color: '#2196f3' },
  ];

  recentOrders = [
    { id: '#001', customer: 'João Silva', total: 'R$ 259,90', status: 'Pago' },
    { id: '#002', customer: 'Maria Santos', total: 'R$ 89,90', status: 'Enviado' },
    { id: '#003', customer: 'Pedro Costa', total: 'R$ 149,90', status: 'Pendente' },
    { id: '#004', customer: 'Ana Oliveira', total: 'R$ 499,90', status: 'Pago' },
  ];

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'Pago': '#4caf50',
      'Pendente': '#ff9800',
      'Enviado': '#2196f3',
    };
    return colors[status] || '#999';
  }
}
