// shared/models/auth.ts
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  id: string;
  token: string;
  nome: string;
  email: string;
  nivelAcesso: string;
  telefone: string | null;
  cpf: string | null;
}
