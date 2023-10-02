import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { HasRoleGuard } from '@core/guards/has-role.guard';

const landingPageModule = () =>
  import('./features/landing-page/landing-page.module').then(
    (m) => m.LandingPageModule
  );

const authModule = () =>
  import('./features/auth/auth.module').then((m) => m.AuthModule);

const userProfileModule = () =>
  import('./features/user-profile/user-profile.module').then(
    (m) => m.UserProfileModule
  );

const shopModule = () =>
  import('./features/shop/shop.module').then((m) => m.ShopModule);

const shoppingCartModule = () =>
  import('./features/shopping-cart/shopping-cart.module').then(
    (m) => m.ShoppingCartModule
  );

const materialPageModule = () =>
  import('./features/material-page/material-page.module').then(
    (m) => m.MaterialPageModule
  );

const inspirationPageModule = () =>
  import('./features/inspiration-page/inspiration-page.module').then(
    (m) => m.InspirationPageModule
  );

const contactPageModule = () =>
  import('./features/contact-page/contact-page.module').then(
    (m) => m.ContactPageModule
  );

const legalModule = () =>
  import('./features/legal/legal.module').then((m) => m.LegalModule);

const orderSuccessPageModule = () =>
  import('./features/order-success-page/order-success-page.module').then(
    (m) => m.OrderSuccessPageModule
  );

const adminModule = () =>
  import('./features/admin/admin.module').then((m) => m.AdminModule);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: landingPageModule
  },
  {
    path: 'auth',
    loadChildren: authModule
  },
  {
    path: 'admin',
    loadChildren: adminModule,
    canActivate: [HasRoleGuard],
    data: { role: 'admin' }
  },
  {
    path: 'user-profile',
    loadChildren: userProfileModule
  },
  {
    path: 'shop',
    loadChildren: shopModule
  },
  {
    path: 'shopping-cart',
    loadChildren: shoppingCartModule,
    canActivate: [AuthGuard]
  },
  {
    path: 'material',
    loadChildren: materialPageModule
  },
  {
    path: 'inspiration',
    loadChildren: inspirationPageModule
  },
  {
    path: 'contact',
    loadChildren: contactPageModule
  },
  {
    path: 'legal',
    loadChildren: legalModule
  },
  {
    path: 'order-success/:id',
    loadChildren: orderSuccessPageModule
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
