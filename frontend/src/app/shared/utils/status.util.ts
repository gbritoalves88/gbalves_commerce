import { StatusPedido } from '../enums/status-pedido.enum';
import { StatusPagamento } from '../enums/status-pagamento.enum';

export class StatusUtil {

  static getStatusPedidoLabel(status: string): string {
    const labels: Record<string, string> = {
      [StatusPedido.Criado]: 'Pedido Criado',
      [StatusPedido.Preparando]: 'Em Preparação',
      [StatusPedido.Enviado]: 'Enviado',
      [StatusPedido.Entregue]: 'Entregue',
      [StatusPedido.Cancelado]: 'Cancelado'
    };
    return labels[status] || status;
  }

  static getStatusPagamentoLabel(status: string): string {
    const labels: Record<string, string> = {
      [StatusPagamento.Pendente]: 'Pagamento Pendente',
      [StatusPagamento.Aprovado]: 'Pagamento Aprovado',
      [StatusPagamento.Recusado]: 'Pagamento Recusado',
      [StatusPagamento.Cancelado]: 'Pagamento Cancelado',
      [StatusPagamento.Reembolsado]: 'Reembolsado',
      [StatusPagamento.Estornado]: 'Estornado'
    };
    return labels[status] || status;
  }

  static getStatusPedidoColor(status: string): string {
    const colors: Record<string, string> = {
      [StatusPedido.Criado]: '#ff9800',
      [StatusPedido.Preparando]: '#2196f3',
      [StatusPedido.Enviado]: '#4caf50',
      [StatusPedido.Entregue]: '#9c27b0',
      [StatusPedido.Cancelado]: '#f44336'
    };
    return colors[status] || '#999';
  }

  static getStatusPagamentoColor(status: string): string {
    const colors: Record<string, string> = {
      [StatusPagamento.Pendente]: '#ff9800',
      [StatusPagamento.Aprovado]: '#4caf50',
      [StatusPagamento.Recusado]: '#f44336',
      [StatusPagamento.Cancelado]: '#999',
      [StatusPagamento.Reembolsado]: '#ff9800',
      [StatusPagamento.Estornado]: '#f44336'
    };
    return colors[status] || '#999';
  }
}
