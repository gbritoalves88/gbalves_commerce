// shared/services/alert.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AlertService {

  private showToast(message: string, type: string): void {
    let container = document.querySelector('.alert-toast-container') as HTMLElement;
    if (!container) {
      container = document.createElement('div');
      container.className = 'alert-toast-container';
      container.style.cssText = `
        position: fixed;
        top: 70px;
        right: 16px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 8px;
      `;
      document.body.appendChild(container);
    }

    const colors: Record<string, { border: string; icon: string; iconChar: string }> = {
      success: { border: '#4caf50', icon: '#4caf50', iconChar: '✓' },
      error: { border: '#e74c3c', icon: '#e74c3c', iconChar: '✗' },
      info: { border: '#2196f3', icon: '#2196f3', iconChar: 'ℹ' },
      warning: { border: '#ff9800', icon: '#ff9800', iconChar: '⚠' }
    };

    const color = colors[type] || colors['info'];

    const toast = document.createElement('div');
    toast.className = 'alert-toast';
    toast.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: #ffffff;
      border-radius: 8px;
      border-left: 4px solid ${color.border};
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      min-width: 280px;
      max-width: 350px;
      animation: slideIn 0.3s ease;
      font-family: 'Roboto', sans-serif;
    `;

    toast.innerHTML = `
      <span style="font-size: 18px; font-weight: bold; color: ${color.icon}">${color.iconChar}</span>
      <span style="flex: 1; font-size: 14px; color: #333333;">${message}</span>
      <button style="background: none; border: none; font-size: 18px; cursor: pointer; color: #999999; padding: 0 4px;">×</button>
    `;

    const closeBtn = toast.querySelector('button');
    closeBtn?.addEventListener('click', () => toast.remove());

    container.appendChild(toast);

    setTimeout(() => toast.remove(), 4000);
  }

  success(message: string): void { this.showToast(message, 'success'); }
  error(message: string): void { this.showToast(message, 'error'); }
  info(message: string): void { this.showToast(message, 'info'); }
  warning(message: string): void { this.showToast(message, 'warning'); }
}
