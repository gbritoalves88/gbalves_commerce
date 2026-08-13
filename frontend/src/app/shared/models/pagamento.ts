// shared/models/pagamento.ts
export interface CriarCheckoutRequest {
  pedidoId: string;
  metodoPagamento: string;
  emailComprador: string;
  nomeComprador?: string;
  cpfComprador?: string;
  token?: string;
  parcelas?: number;
}

export interface CriarCheckoutResponse {
  pagamentoId: string;
  status: string;          // "approved", "pending", "rejected"
  qrCode?: string;         // Apenas PIX
  qrCodeBase64?: string;   // Apenas PIX
}
