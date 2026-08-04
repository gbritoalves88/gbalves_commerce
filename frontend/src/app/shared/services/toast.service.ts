// shared/services/toast.service.ts
import { Injectable, inject, ApplicationRef } from '@angular/core';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private appRef = inject(ApplicationRef);
  messages: ToastMessage[] = [];
  private id = 0;

  sucesso(message: string): void { this.add(message, 'success'); }
  erro(message: string): void { this.add(message, 'error'); }
  info(message: string): void { this.add(message, 'info'); }
  aviso(message: string): void { this.add(message, 'warning'); }

  private add(message: string, type: ToastMessage['type']): void {
    setTimeout(() => {
      const msg: ToastMessage = { id: this.id++, type, message };
      this.messages = [...this.messages, msg];
      setTimeout(() => {
        this.messages = this.messages.filter(m => m.id !== msg.id);
      }, 4000);
    });
  }
}
