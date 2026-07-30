// shared/models/pedido.ts

// Request - Criar pedido (checkout)
export interface CriarPedidoRequest {
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone?: string;
  clienteCpf?: string;
  cep?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  formaPagamento: string;
  itens: ItemPedidoRequest[];
}

export interface ItemPedidoRequest {
  produtoId: string;
  quantidade: number;
}

// Response - API retorna
export interface PedidoResponse {
  id: string;
  numeroPedido: number;
  status: string;
  subtotal: number;
  frete: number;
  total: number;
  formaPagamento: string;
  clienteNome: string;
  criadoEm: string;
}
