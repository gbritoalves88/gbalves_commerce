// shared/toast/toast.component.ts
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="toast-container">
      @for (msg of toastService.messages; track msg.id) {
        <div class="toast" [class]="msg.type">
          <mat-icon>{{ getIcon(msg.type) }}</mat-icon>
          <span>{{ msg.message }}</span>
          <button (click)="fechar(msg.id)">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 400px;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 20px;
      border-radius: 10px;
      color: white;
      font-weight: 500;
      font-size: 0.9rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .success { background: #4caf50; }
    .error { background: #f44336; }
    .info { background: #2196f3; }
    .warning { background: #ff9800; }
    .toast button {
      background: none; border: none; color: white;
      cursor: pointer; padding: 0; opacity: 0.7; margin-left: auto;
    }
    .toast button:hover { opacity: 1; }
    .toast mat-icon { font-size: 20px; width: 20px; height: 20px; }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: 'check_circle',
      error: 'error',
      info: 'info',
      warning: 'warning'
    };
    return icons[type] || 'info';
  }

  fechar(id: number): void {
    const index = this.toastService.messages.findIndex(m => m.id === id);
    if (index > -1) this.toastService.messages.splice(index, 1);
  }
}
