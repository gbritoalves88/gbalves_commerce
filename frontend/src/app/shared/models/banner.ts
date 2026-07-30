// shared/models/banner.ts
export interface Banner {
  id: string;
  titulo: string;
  subtitulo: string | null;
  imagemUrl: string;
  link: string | null;
  textoBotao: string | null;
  ordemExibicao: number;
  ativo: boolean;
}
