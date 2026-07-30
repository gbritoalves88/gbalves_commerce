// features/admin/dashboard/dashboard.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { Dashboard } from '../../../shared/models/dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  dados = signal<Dashboard | null>(null);

  ngOnInit(): void {
    this.dashboardService.obterResumo().subscribe(d => this.dados.set(d));
  }

  stats(): { label: string; value: string | number; icon: string; color: string }[] {
    if (!this.dados()) return [];
    const d = this.dados()!;
    return [
      { label: 'Pedidos Hoje', value: d.totalPedidosHoje, icon: 'receipt_long', color: '#1a237e' },
      { label: 'Faturamento', value: `R$ ${d.faturamento.toFixed(2)}`, icon: 'payments', color: '#4caf50' },
      { label: 'Produtos', value: d.totalProdutos, icon: 'inventory_2', color: '#ff9800' },
      { label: 'Clientes', value: d.totalClientes, icon: 'people', color: '#2196f3' },
    ];
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
