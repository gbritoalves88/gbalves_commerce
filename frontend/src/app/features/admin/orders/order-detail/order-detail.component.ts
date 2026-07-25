// features/admin/orders/order-detail/order-detail.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { OrderService, Order } from '../../../../shared/services/order.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    DatePipe,
    RouterModule
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit {
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  order: Order | undefined;
  statuses: Order['status'][] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.order = this.orderService.getById(id);
  }

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

  updateStatus(newStatus: Order['status']): void {
    if (this.order) {
      this.orderService.updateStatus(this.order.id, newStatus);
      this.order.status = newStatus;
    }
  }
}
