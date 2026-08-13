// app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProdutoListaComponent } from './features/produtos/produto-lista/produto-lista.component';
import { ProdutoDetalheComponent } from './features/produtos/produto-detalhe/produto-detalhe.component';
import { CarrinhoComponent } from './features/carrinho/carrinho.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { PedidoConfirmadoComponent } from './features/pedido-confirmado/pedido-confirmado.component';
import { LoginComponent } from './features/login/login.component';
import { AdminLayoutComponent } from './features/admin/admin-layout/admin-layout.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { ProdutosComponent } from './features/admin/produtos/produtos.component';
import { ProductFormComponent } from './features/admin/produtos/produtos-form/produto-form.component';
import { CategoriasComponent } from './features/admin/categorias/categorias.component';
import { CategoriaFormComponent } from './features/admin/categorias/categoria-form/categoria-form.component';
import { PedidosComponent } from './features/admin/pedidos/pedidos.component';
import { PedidoDetalhesComponent } from './features/admin/pedidos/pedidos-detalhes/pedido-detalhes.component';
import { PerfilComponent } from './features/perfil/perfil/perfil.component';
import { MeusPedidosComponent } from './features/perfil/meus-pedidos/meus-pedidos.component';
import { ConfiguracoesComponent } from './features/admin/configuracoes/configuracoes.component';
import { authGuard } from './shared/guards/auth.guard';
import { adminGuard, operadorGuard } from './shared/guards/admin.guard';
import { BannersComponent } from './features/admin/banners/banners.component';
import { BannerFormComponent } from './features/admin/banners/banner-form/banner-form.component';
import { MenusComponent } from './features/admin/menus/menus.component';
import { CadastroComponent } from './features/cadastro/cadastro.component';
import { InstitucionalComponent } from './features/institucional/institucional.component';
import { PagamentoComponent } from './features/pagamento/pagamento.component';

export const routes: Routes = [
  // Loja (público)
  { path: '', component: HomeComponent },
  { path: 'produtos', component: ProdutoListaComponent },
  { path: 'produtos/:slug', component: ProdutoDetalheComponent },
  { path: 'carrinho', component: CarrinhoComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'pedido-confirmado/:id', component: PedidoConfirmadoComponent },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'perfil/pedidos', component: MeusPedidosComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'pagina/:pagina', component: InstitucionalComponent },
  { path: 'pagamento/:pedidoId', component: PagamentoComponent, canActivate: [authGuard] },

  // Admin (com sidebar)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [operadorGuard],  // Admin ou Operador
    children: [
      // Operador e Admin
      { path: '', component: DashboardComponent },
      { path: 'produtos', component: ProdutosComponent },
      { path: 'produtos/new', component: ProductFormComponent },
      { path: 'produtos/edit/:id', component: ProductFormComponent },
      { path: 'categorias', component: CategoriasComponent },
      { path: 'categorias/new', component: CategoriaFormComponent },
      { path: 'categorias/edit/:id', component: CategoriaFormComponent },
      { path: 'pedidos', component: PedidosComponent },
      { path: 'pedidos/:id', component: PedidoDetalhesComponent },

      // Somente Admin
      { path: 'configuracoes', component: ConfiguracoesComponent, canActivate: [adminGuard] },
      { path: 'banners', component: BannersComponent, canActivate: [adminGuard] },
      { path: 'banners/new', component: BannerFormComponent, canActivate: [adminGuard] },
      { path: 'banners/edit/:id', component: BannerFormComponent, canActivate: [adminGuard] },
      { path: 'menus', component: MenusComponent, canActivate: [adminGuard] },
    ]
  }
];
