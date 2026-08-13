// features/admin/pedidos/pedido-detalhes/pedido-detalhes.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { PedidoService } from '../../../../shared/services/pedido.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { PedidoResponse } from '../../../../shared/models/pedido';
import { StatusUtil } from '../../../../shared/utils/status.util';
import { StatusPedido } from '../../../../shared/enums/status-pedido.enum';

@Component({
  selector: 'app-pedido-detalhes',
  standalone: true,
  imports: [
    MatIconModule, MatButtonModule, MatSelectModule,
    MatFormFieldModule, MatInputModule, FormsModule, DatePipe, RouterModule
  ],
  templateUrl: './pedido-detalhes.component.html',
  styleUrl: './pedido-detalhes.component.scss'
})
export class PedidoDetalhesComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private alertService = inject(AlertService);

  novoStatusSelecionado: string | null = null;
  pedido: PedidoResponse | undefined;
  statusList = Object.values(StatusPedido);
  codigoRastreio = '';

  ngOnInit(): void {
    this.carregarPedido();
  }

  carregarPedido(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pedidoService.obterPorId(id).subscribe(p => {
        this.pedido = p;
        this.cdr.markForCheck();
      });
    }
  }

  getStatusLabel(status: string): string {
    return StatusUtil.getStatusPedidoLabel(status);
  }

  getStatusColor(status: string): string {
    return StatusUtil.getStatusPedidoColor(status);
  }

  atualizarStatus(): void {
    if (!this.pedido || !this.novoStatusSelecionado) return;
    this.pedidoService.atualizarStatus(this.pedido.id, this.novoStatusSelecionado).subscribe({
      next: () => {
        this.pedido!.status = this.novoStatusSelecionado!;
        this.novoStatusSelecionado = null;
        this.alertService.success('Status atualizado!');
        this.cdr.markForCheck();
      },
      error: () => this.alertService.error('Erro ao atualizar status')
    });
  }

  verificarPagamento(): void {
    if (!this.pedido) return;
    this.pedidoService.verificarPagamento(this.pedido.id).subscribe({
      next: (res) => {
        if (res.status === 'approved') this.alertService.success('Pagamento aprovado! ✅');
        else if (res.status === 'pending') this.alertService.info('Pagamento pendente ⏳');
        else if (res.status === 'rejected') this.alertService.error('Pagamento recusado ❌');
        else this.alertService.warning('Sem informação de pagamento');
      },
      error: () => this.alertService.error('Erro ao verificar')
    });
  }

  confirmarPagamento(): void {
    if (!this.pedido || !this.pedido.pagamentoId) return;

    this.pedidoService.confirmarPagamento(this.pedido.pagamentoId).subscribe({
      next: () => {
        this.alertService.success('Pagamento confirmado!');
        this.carregarPedido();
      },
      error: () => this.alertService.error('Erro ao confirmar')
    });
  }

  salvarRastreio(): void {
    if (!this.pedido || !this.codigoRastreio) return;
    this.pedidoService.salvarRastreio(this.pedido.id, this.codigoRastreio).subscribe({
      next: () => {
        this.alertService.success('Rastreio salvo!');
        this.carregarPedido();
      },
      error: () => this.alertService.error('Erro ao salvar rastreio')
    });
  }

  cancelarPedido(): void {
    if (!this.pedido) return;
    if (!confirm('Cancelar este pedido? Os produtos voltarão ao estoque.')) return;

    this.pedidoService.cancelarPedido(this.pedido.id).subscribe({
      next: () => {
        this.alertService.success('Pedido cancelado e estoque restaurado!');
        this.carregarPedido();
      },
      error: (err) => {
        this.alertService.error(err.error?.erro || 'Erro ao cancelar');
      }
    });
  }
}
