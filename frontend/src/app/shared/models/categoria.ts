export interface Categoria {
  id: string;
  nome: string;
  slug: string;
  imagemUrl: string | null;
  ordemExibicao: number;
  ativo: boolean;
  totalProdutos: number;
}
