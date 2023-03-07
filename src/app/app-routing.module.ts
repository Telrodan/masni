import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './features/landing/landing.component';
import { ContactComponent } from './features/contact/contact.component';
import { SamplesComponent } from './shared/UI/samples/samples.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { LoginComponent } from './features/auth/login/login.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ShoppingCartComponent } from './shared/UI/shopping-cart/shopping-cart.component';
import { ShopComponent } from './features/shop/shop.component';
import { PrivacyPolicyComponent } from './features/privacy-policy/privacy-policy.component';

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
    component: LandingComponent
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
    component: ShopComponent
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
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
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
