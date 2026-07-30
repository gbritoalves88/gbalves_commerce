// features/pedido-confirmado/pedido-confirmado.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pedido-confirmado',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './pedido-confirmado.component.html',
  styleUrl: './pedido-confirmado.component.scss'
})
export class PedidoConfirmadoComponent implements OnInit {
  orderId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') || '00000';
  }
}
