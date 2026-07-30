// shared/models/carrinho.ts
export interface CarrinhoItem {
  produto: {
    id: string;
    nome: string;
    slug: string;
    preco: number;
    imagemUrl: string | null;
    estoque: number;
  };
  quantidade: number;
}
