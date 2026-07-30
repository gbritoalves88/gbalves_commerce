// shared/models/dashboard.ts
export interface Dashboard {  // ← Nome correto
  totalPedidosHoje: number;
  faturamento: number;
  totalProdutos: number;
  totalClientes: number;
  ultimosPedidos: PedidoRecente[];
}

export interface PedidoRecente {
  id: string;
  numeroPedido: number;
  clienteNome: string;
  total: number;
  status: string;
  criadoEm: string;
}
