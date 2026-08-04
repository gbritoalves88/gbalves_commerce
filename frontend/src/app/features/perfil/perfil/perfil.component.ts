// features/perfil/perfil.component.ts
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { PerfilService } from '../../../shared/services/perfil.service';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, FormsModule, RouterModule
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  private authService = inject(AuthService);
  private perfilService = inject(PerfilService);
  private alertService = inject(AlertService);
  private cdr = inject(ChangeDetectorRef);
  activeTab = 'info';

  usuario = {
    nome: '',
    email: '',
    telefone: '',
    cpf: ''
  };

  salvando = false;

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.usuario.nome = user.nome || '';
      this.usuario.email = user.email || '';
      this.usuario.telefone = user.telefone || '';
      this.usuario.cpf = user.cpf || '';
      this.cdr.markForCheck();
    }
  }

  salvarPerfil(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;
    this.salvando = true;

    this.perfilService.atualizar(userId, {
      nome: this.usuario.nome,
      email: this.usuario.email
    }).subscribe({
      next: () => {
        this.alertService.success('Perfil atualizado com sucesso!');
        this.salvando = false;
      },
      error: () => {
        this.alertService.error('Erro ao atualizar perfil.');
        this.salvando = false;
      }
    });
  }
}
