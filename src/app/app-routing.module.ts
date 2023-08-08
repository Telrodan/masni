import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContactComponent } from './features/contact/contact.component';
import { SamplesComponent } from './features/samples/samples.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ShoppingCartComponent } from './features/shopping-cart/shopping-cart.component';
import { ShopComponent } from './features/shop/shop.component';
import { PrivacyPolicyComponent } from './features/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './features/terms-and-conditions/terms-and-conditions.component';
import { ProductDetailsComponent } from './features/shop/components/product-details/product-details.component';
import { HasRoleGuard } from '@core/guards/has-role.guard';
import { UserProfileComponent } from './features/user-profile/user-profile.component';
import { InspirationPageComponent } from './features/inspiration-page/inspiration-page.component';
import { OrderSuccessComponent } from './shared/UI/order-success/order-success.component';

const landingPageModule = () =>
  import('./features/landing-page/landing-page.module').then(
    (m) => m.LandingPageModule
  );

const authModule = () =>
  import('./features/auth/auth.module').then((m) => m.AuthModule);

const adminModule = () =>
  import('./features/admin/admin.module').then((m) => m.AdminModule);

const nyuszkoShopModule = () =>
  import('./features/nyuszko-shop/nyuszko-shop.module').then(
    (m) => m.NyuszkoShopModule
  );

const masniShopModule = () =>
  import('./features/masni-shop/masni-shop.module').then(
    (m) => m.MasniShopModule
  );

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
    path: 'user',
    component: UserProfileComponent
  },
  {
    path: 'nyuszko-shop',
    loadChildren: nyuszkoShopModule
  },
  {
    path: 'masni-shop',
    loadChildren: masniShopModule
  },
  {
    path: 'shop',
    children: [
      {
        path: '',
        component: ShopComponent
      },
      {
        path: ':id',
        component: ProductDetailsComponent
      }
    ]
  },
  {
    path: 'shopping-cart',
    component: ShoppingCartComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'samples',
    component: SamplesComponent
  },
  {
    path: 'inspiration',
    component: InspirationPageComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent
  },
  {
    path: 'order-success/:id',
    component: OrderSuccessComponent
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
