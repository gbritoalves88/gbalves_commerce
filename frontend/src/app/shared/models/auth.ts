// shared/models/auth.ts
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  nome: string;
  email: string;
  nivelAcesso: string;
}
