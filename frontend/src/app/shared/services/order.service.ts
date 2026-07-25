// shared/services/order.service.ts
import { Injectable, signal } from '@angular/core';
import { CartItem } from './cart.service';

export interface Order {
  id: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    paymentMethod: string;
  };
  items: CartItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orders = signal<Order[]>(this.loadOrders());

  private loadOrders(): Order[] {
    const saved = localStorage.getItem('admin_orders');
    if (saved) return JSON.parse(saved);
    
    // Mock inicial
    return [
      {
        id: 1001,
        customer: { name: 'João Silva', email: 'joao@email.com', phone: '(11) 99999-0001', cpf: '123.456.789-00', cep: '01001-000', street: 'Rua A', number: '100', neighborhood: 'Centro', city: 'São Paulo', state: 'SP', paymentMethod: 'pix' },
        items: [],
        total: 259.90,
        status: 'paid',
        date: new Date('2026-07-20')
      },
      {
        id: 1002,
        customer: { name: 'Maria Santos', email: 'maria@email.com', phone: '(11) 99999-0002', cpf: '987.654.321-00', cep: '02002-000', street: 'Rua B', number: '200', neighborhood: 'Jardins', city: 'São Paulo', state: 'SP', paymentMethod: 'credit' },
        items: [],
        total: 89.90,
        status: 'shipped',
        date: new Date('2026-07-21')
      },
      {
        id: 1003,
        customer: { name: 'Pedro Costa', email: 'pedro@email.com', phone: '(11) 99999-0003', cpf: '456.789.123-00', cep: '03003-000', street: 'Rua C', number: '300', neighborhood: 'Vila Mariana', city: 'São Paulo', state: 'SP', paymentMethod: 'pix' },
        items: [],
        total: 149.90,
        status: 'pending',
        date: new Date('2026-07-22')
      }
    ];
  }

  private saveOrders(orders: Order[]): void {
    localStorage.setItem('admin_orders', JSON.stringify(orders));
    this.orders.set(orders);
  }

  getAll(): Order[] {
    return this.orders();
  }

  getById(id: number): Order | undefined {
    return this.orders().find(o => o.id === id);
  }

  updateStatus(id: number, status: Order['status']): void {
    const orders = this.orders();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index].status = status;
      this.saveOrders(orders);
    }
  }
}