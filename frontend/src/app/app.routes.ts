// app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { ProductDetailComponent } from './features/products/product-detail/product-detail.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { OrderConfirmedComponent } from './features/order-confirmed/order-confirmed.component';
import { LoginComponent } from './features/login/login.component';
import { AdminLayoutComponent } from './features/admin/admin-layout/admin-layout.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { ProductsComponent } from './features/admin/products/products.component';
import { ProductFormComponent } from './features/admin/products/product-form/product-form.component';
import { CategoriesComponent } from './features/admin/categories/categories.component';
import { CategoryFormComponent } from './features/admin/categories/category-form/category-form.component';
import { OrdersComponent } from './features/admin/orders/orders.component';
import { OrderDetailComponent } from './features/admin/orders/order-detail/order-detail.component';
import { ProfileComponent } from './features/profile/profile.component';
import { MyOrdersComponent } from './features/profile/my-orders/my-orders.component';
import { authGuard } from './shared/guards/auth.guard';


export const routes: Routes = [
  // Loja (público)
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:slug', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'order-confirmed/:id', component: OrderConfirmedComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'profile/orders', component: MyOrdersComponent, canActivate: [authGuard] },

  // Login
  { path: 'login', component: LoginComponent },

  // Admin (com sidebar)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: DashboardComponent, canActivate: [authGuard]  },
      { path: 'products', component: ProductsComponent,canActivate: [authGuard]  },
      { path: 'products/new', component: ProductFormComponent,canActivate: [authGuard]  },
      { path: 'products/edit/:id', component: ProductFormComponent,canActivate: [authGuard]  },
      { path: 'categories', component: CategoriesComponent,canActivate: [authGuard]  },
      { path: 'categories/new', component: CategoryFormComponent,canActivate: [authGuard]  },
      { path: 'categories/edit/:id', component: CategoryFormComponent,canActivate: [authGuard]  },
      { path: 'orders', component: OrdersComponent,canActivate: [authGuard]  },
      { path: 'orders/:id', component: OrderDetailComponent,canActivate: [authGuard]  }
    ]
  }
];
