// shared/models/pedido.ts

export interface ItemPedidoRequest {
  produtoId: string;
  quantidade: number;
}

export interface ItemPedidoResponse {
  id: string;
  nomeProduto: string;
  imagemProduto: string | null;
  preco: number;
  quantidade: number;
  total: number;
}

export interface CriarPedidoRequest {
  clienteTelefone?: string | null;
  clienteCpf?: string | null;
  cep?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  frete?: number;
  transportadora?: string | null;
  servicoFrete?: string | null;
  itens: ItemPedidoRequest[];
}

export interface PedidoResponse {
  id: string;
  numeroPedido: number;
  status: string;
  subtotal: number;
  frete: number;
  total: number;
  formaPagamento: string | null;
  statusPagamento: string | null;
  clienteNome: string;
  clienteEmail: string | null;
  clienteTelefone: string | null;
  cep: string | null;
  rua: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  criadoEm: string;
  itens: ItemPedidoResponse[];
  pagamentoId: string | null;
  gatewayPagamentoId: string | null;
  codigoRastreio: string | null;
  transportadora: string | null;
  servicoFrete: string | null;
}

export interface PedidoResumo {
  id: string;
  numeroPedido: number;
  status: string;
  total: number;
  criadoEm: string;
}
