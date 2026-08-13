// features/admin/dashboard/dashboard.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { ApiService } from '../../../shared/services/api.service';
import { AlertService } from '../../../shared/services/alert.service';
import { Dashboard } from '../../../shared/models/dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private api = inject(ApiService);
  private alertService = inject(AlertService);

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
      'Pendente': '#ff9800', 'Pago': '#4caf50',
      'Enviado': '#2196f3', 'Entregue': '#9c27b0', 'Cancelado': '#f44336',
      'Criado': '#ff9800', 'Preparando': '#2196f3'
    };
    return colors[status] || '#999';
  }

  exportar(): void {
    this.api.getBlob('Relatorio/excel').subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-${new Date().toISOString().slice(0,10)}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.alertService.success('Relatório baixado!');
      },
      error: () => this.alertService.error('Erro ao gerar relatório')
    });
  }
}
