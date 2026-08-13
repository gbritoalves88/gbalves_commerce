// features/cadastro/cadastro.component.ts
import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { ApiService } from '../../shared/services/api.service';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, FormsModule, RouterModule
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  private authService = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  usuario = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    cpf: ''
  };

  error = '';
  hidePassword = true;
  loading = false;

  onSubmit(): void {
    this.error = '';

    if (!this.usuario.nome || !this.usuario.email || !this.usuario.senha) {
      this.error = 'Preencha todos os campos obrigatórios.';
      return;
    }

    if (this.usuario.senha !== this.usuario.confirmarSenha) {
      this.error = 'As senhas não conferem.';
      return;
    }

    this.loading = true;

    this.api.post('Usuarios', {
      nome: this.usuario.nome,
      email: this.usuario.email,
      senha: this.usuario.senha,
      telefone: this.usuario.telefone,
      cpf: this.usuario.cpf,
      nivelAcesso: 'cliente'
    }).subscribe({
      next: () => {
        this.authService.login(this.usuario.email, this.usuario.senha).subscribe({
          next: () => {
            this.alertService.success('Conta criada com sucesso!');
            this.router.navigate(['/perfil']);
          },
          error: () => {
            this.alertService.success('Conta criada! Faça login.');
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.errors?.Email || 'Erro ao criar conta.';
      }
    });
  }
}
