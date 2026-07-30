export interface Produto {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  preco: number;
  precoOriginal: number | null;
  imagemUrl: string | null;
  estoque: number;
  destaque: boolean;
  ativo: boolean;
  categoriaId: string | null;    // ← UUID da categoria
  categoriaNome: string | null;  // ← Nome para exibição
  criadoEm: string;
}
