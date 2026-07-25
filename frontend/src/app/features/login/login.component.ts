// features/login/login.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  email = 'admin@gbalves.com';
  password = 'admin123';
  error = '';
  hidePassword = true;
  returnUrl = '/';

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Se já estiver logado, redireciona
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  onSubmit(): void {
    this.error = '';

    if (!this.email || !this.password) {
      this.error = 'Preencha todos os campos.';
      return;
    }

    const success = this.authService.login(this.email, this.password);

    if (success) {
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.error = 'Email ou senha inválidos.';
    }
  }

  quickLogin(): void {
    this.authService.login('admin@gbalves.com', 'admin123');
    this.router.navigateByUrl(this.returnUrl);
  }
}
