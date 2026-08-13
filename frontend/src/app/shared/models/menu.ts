export interface Menu {
  id: string;
  nome: string;
  localizacao: string;
  ativo: boolean;      // ← adicionar
  itens: MenuItem[];
}

export interface MenuItem {
  id: string;
  nome: string;
  slug: string | null;
  url: string | null;
  icone: string | null;
  ordemExibicao: number;
  ativo: boolean;       // ← adicionar
  subItens?: MenuItem[];
}
