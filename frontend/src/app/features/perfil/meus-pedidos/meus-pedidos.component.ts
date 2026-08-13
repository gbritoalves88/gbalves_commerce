import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { PedidoService } from '../../../shared/services/pedido.service';
import { AuthService } from '../../../shared/services/auth.service'; // Adicione esta linha
import { PedidoResumo } from '../../../shared/models/pedido'
import { StatusUtil } from '../../../shared/utils/status.util';

@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [MatIconModule, RouterModule, DatePipe],
  templateUrl: './meus-pedidos.component.html',
  styleUrl: './meus-pedidos.component.scss'
})
export class MeusPedidosComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  pedidos: PedidoResumo[] = [];
  loading = true;
  usuario: any = {};

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.usuario.nome = user.nome || '';
      this.usuario.email = user.email || '';
      this.usuario.telefone = user.telefone || '';
      this.usuario.cpf = user.cpf || '';
      this.cdr.markForCheck();
    }

    this.pedidoService.meusPedidos().subscribe({
      next: (p) => {
        this.pedidos = p;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  getStatusLabel(status: string): string {
    return StatusUtil.getStatusPedidoLabel(status);
  }

  getStatusColor(status: string): string {
    return StatusUtil.getStatusPedidoColor(status);
  }
}
