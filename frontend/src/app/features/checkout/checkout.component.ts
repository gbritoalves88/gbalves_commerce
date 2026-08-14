// features/checkout/checkout.component.ts
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { CarrinhoService } from '../../shared/services/carrinho.service';
import { PedidoService } from '../../shared/services/pedido.service';
import { AuthService } from '../../shared/services/auth.service';
import { AlertService } from '../../shared/services/alert.service';
import { FreteService, FreteResponse } from '../../shared/services/frete.service';
import { CepService } from '../../shared/services/cep.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatRadioModule, FormsModule, RouterModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  private carrinhoService = inject(CarrinhoService);
  private pedidoService = inject(PedidoService);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private freteService = inject(FreteService);
  private cepService = inject(CepService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  cartItems = this.carrinhoService.cartItems;
  cartTotal = this.carrinhoService.cartTotal;

  fretes: FreteResponse[] = [];
  freteSelecionado: FreteResponse | null = null;
  calculandoFrete = false;

  cliente = {
    telefone: '', cpf: '',
    cep: '', rua: '', numero: '', complemento: '',
    bairro: '', cidade: '', estado: '', formaPagamento: 'pix'
  };

  loading = false;

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.cliente.telefone = this.formatarTelefone(user.telefone || '');
      this.cliente.cpf = this.formatarCpf(user.cpf || '');
      this.cdr.markForCheck();
    }
  }

  get total(): number { return this.cartTotal(); }

  get totalComFrete(): number {
    return this.cartTotal() + (this.freteSelecionado?.valor || 0);
  }

  // ========== MÁSCARAS ==========
  onTelefoneInput(event: any): void {
    const valor = event.target.value;
    this.cliente.telefone = this.formatarTelefone(valor);
  }

  onCpfInput(event: any): void {
    const valor = event.target.value;
    this.cliente.cpf = this.formatarCpf(valor);
  }

  onCepInput(event: any): void {
    const valor = event.target.value;
    this.cliente.cep = this.formatarCep(valor);
  }

  onUfInput(event: any): void {
    const valor = event.target.value.toUpperCase();
    this.cliente.estado = valor.replace(/[^A-Z]/g, '');
  }

  private formatarTelefone(value: string): string {
    const numeros = value.replace(/\D/g, '');

    if (numeros.length === 0) return '';
    if (numeros.length <= 2) return `(${numeros}`;
    if (numeros.length <= 6) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    if (numeros.length <= 10) return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
  }

  private formatarCpf(value: string): string {
    const numeros = value.replace(/\D/g, '');

    if (numeros.length === 0) return '';
    if (numeros.length <= 3) return numeros;
    if (numeros.length <= 6) return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
    if (numeros.length <= 9) return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
    return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9, 11)}`;
  }

  private formatarCep(value: string): string {
    const numeros = value.replace(/\D/g, '');

    if (numeros.length === 0) return '';
    if (numeros.length <= 5) return numeros;
    return `${numeros.slice(0, 5)}-${numeros.slice(5, 8)}`;
  }

  // ========== VALIDAÇÕES ==========
  private validarCpf(cpf: string): boolean {
    const numeros = cpf.replace(/\D/g, '');

    if (numeros.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(numeros)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(numeros.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== parseInt(numeros.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(numeros.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== parseInt(numeros.charAt(10))) return false;

    return true;
  }

  private validarTelefone(telefone: string): boolean {
    const numeros = telefone.replace(/\D/g, '');

    if (numeros.length < 10 || numeros.length > 11) return false;

    const ddd = parseInt(numeros.slice(0, 2));
    if (ddd < 11 || ddd > 99) return false;

    return true;
  }

  private validarCep(cep: string): boolean {
    const numeros = cep.replace(/\D/g, '');
    return numeros.length === 8;
  }

  // ========== BUSCAR CEP ==========
  buscarCep(): void {
    const cepLimpo = this.cliente.cep.replace(/\D/g, '');

    if (!this.validarCep(cepLimpo)) {
      this.alertService.error('CEP inválido! Digite 8 dígitos.');
      return;
    }

    this.cepService.buscarCep(cepLimpo).subscribe({
      next: (data) => {
        this.cliente.rua = data.logradouro;
        this.cliente.bairro = data.bairro;
        this.cliente.cidade = data.localidade;
        this.cliente.estado = data.uf;
        this.cdr.markForCheck();
        this.buscarFrete();
      },
      error: (err) => {
        this.alertService.error(err.message || 'CEP não encontrado!');
      }
    });
  }

  buscarFrete(): void {
    const cepLimpo = this.cliente.cep.replace(/\D/g, '');

    if (!this.validarCep(cepLimpo)) {
      this.alertService.error('CEP inválido!');
      return;
    }

    this.calculandoFrete = true;

    const itens = this.cartItems().map(i => ({
      produtoId: i.produto.id,
      quantidade: i.quantidade
    }));

    this.freteService.calcular({ cepDestino: cepLimpo, itens }).subscribe({
      next: (fretes) => {
        this.fretes = fretes;
        this.calculandoFrete = false;
        if (fretes.length > 0) this.freteSelecionado = fretes[0];
        this.cdr.markForCheck();
      },
      error: () => {
        this.calculandoFrete = false;
        this.alertService.error('Erro ao calcular frete');
      }
    });
  }

  selecionarFrete(frete: FreteResponse): void {
    this.freteSelecionado = frete;
  }

  // ========== FINALIZAR PEDIDO ==========
  finalizarPedido(): void {
    if (this.loading) return;

    // Limpar máscaras
    const telefoneLimpo = this.cliente.telefone.replace(/\D/g, '');
    const cpfLimpo = this.cliente.cpf.replace(/\D/g, '');
    const cepLimpo = this.cliente.cep.replace(/\D/g, '');

    // 1. Telefone
    if (!telefoneLimpo) {
      this.alertService.error('O campo Telefone é obrigatório!');
      return;
    }
    if (!this.validarTelefone(telefoneLimpo)) {
      this.alertService.error('Telefone inválido! Use o formato (11) 91234-5678');
      return;
    }

    // 2. CPF (opcional, mas se preenchido deve ser válido)
    if (cpfLimpo) {
      if (cpfLimpo.length !== 11) {
        this.alertService.error('CPF inválido! Deve ter 11 dígitos.');
        return;
      }
      if (!this.validarCpf(cpfLimpo)) {
        this.alertService.error('CPF inválido! Verifique os dígitos.');
        return;
      }
    }

    // 3. CEP
    if (!cepLimpo) {
      this.alertService.error('O campo CEP é obrigatório!');
      return;
    }
    if (!this.validarCep(cepLimpo)) {
      this.alertService.error('CEP inválido! Deve ter 8 dígitos.');
      return;
    }

    // 4. Rua
    if (!this.cliente.rua.trim()) {
      this.alertService.error('O campo Rua é obrigatório!');
      return;
    }

    // 5. Número
    if (!this.cliente.numero.trim()) {
      this.alertService.error('O campo Número é obrigatório!');
      return;
    }

    // 6. Bairro
    if (!this.cliente.bairro.trim()) {
      this.alertService.error('O campo Bairro é obrigatório!');
      return;
    }

    // 7. Cidade
    if (!this.cliente.cidade.trim()) {
      this.alertService.error('O campo Cidade é obrigatório!');
      return;
    }

    // 8. UF
    if (!this.cliente.estado.trim()) {
      this.alertService.error('O campo UF é obrigatório!');
      return;
    }
    if (this.cliente.estado.length !== 2) {
      this.alertService.error('UF inválida! Use 2 letras (ex: SP, RJ, MG).');
      return;
    }

    // 9. Frete
    if (!this.freteSelecionado) {
      this.alertService.error('Selecione uma opção de frete! Informe o CEP para calcular.');
      return;
    }

    // 10. Forma de pagamento
    if (!this.cliente.formaPagamento) {
      this.alertService.error('Selecione a forma de pagamento!');
      return;
    }

    // Tudo válido - criar pedido
    this.loading = true;

    const pedido = {
      clienteTelefone: telefoneLimpo,
      clienteCpf: cpfLimpo || null,
      cep: cepLimpo,
      rua: this.cliente.rua,
      numero: this.cliente.numero,
      complemento: this.cliente.complemento,
      bairro: this.cliente.bairro,
      cidade: this.cliente.cidade,
      estado: this.cliente.estado.toUpperCase(),
      frete: this.freteSelecionado.valor,
      transportadora: this.freteSelecionado.transportadora,
      servicoFrete: this.freteSelecionado.nome,
      itens: this.cartItems().map(i => ({
        produtoId: i.produto.id,
        quantidade: i.quantidade
      }))
    };

    this.pedidoService.criar(pedido).subscribe({
      next: (response) => {
        this.carrinhoService.clearCart();

        // Passar a forma de pagamento como query param
        this.router.navigate(['/pagamento', response.id], {
          queryParams: { metodo: this.cliente.formaPagamento }
        });
      },
      error: (err) => {
        this.loading = false;
        this.alertService.error(err.error?.erro || 'Erro ao finalizar pedido');
      }
    });
  }

  // ========== VALIDAÇÃO DO FORMULÁRIO ==========
  isFormValid(): boolean {
    const telefoneLimpo = this.cliente.telefone.replace(/\D/g, '');
    const cepLimpo = this.cliente.cep.replace(/\D/g, '');

    return !!(
      telefoneLimpo.length >= 10 &&
      cepLimpo.length === 8 &&
      this.cliente.rua.trim() &&
      this.cliente.numero.trim() &&
      this.cliente.bairro.trim() &&
      this.cliente.cidade.trim() &&
      this.cliente.estado.length === 2 &&
      this.freteSelecionado &&
      this.cliente.formaPagamento
    );
  }
}
