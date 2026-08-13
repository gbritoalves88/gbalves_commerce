// shared/models/config.ts
export interface StoreConfig {
  id: string;
  nomeLoja: string | null;
  logo: string | null;
  favicon: string | null;
  corPrimaria: string;
  corSecundaria: string;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  email: string | null;
  telefone: string | null;
  seoTitulo: string | null;
  seoDescricao: string | null;
}
