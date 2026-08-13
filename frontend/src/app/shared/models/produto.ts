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
  categoriaId: string | null;
  categoriaNome: string | null;
  criadoEm: string;
  peso: number;           // ← novo
  altura: number;         // ← novo
  largura: number;        // ← novo
  comprimento: number;    // ← novo
}
