// features/admin/pedidos/pedidos.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { PedidoService } from '../../../shared/services/pedido.service';
import { StatusUtil } from '../../../shared/utils/status.util';

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
    return StatusUtil.getStatusPedidoLabel(status);
  }

  getStatusColor(status: string): string {
    return StatusUtil.getStatusPedidoColor(status);
  }
}
