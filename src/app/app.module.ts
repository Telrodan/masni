import { APP_INITIALIZER, NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { CarouselModule } from 'primeng/carousel';
import { ImageModule } from 'primeng/image';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ChipsModule } from 'primeng/chips';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptorProvider } from './core/interceptors/auth-interceptor';
import { HttpInterceptorProvider } from './core/interceptors/http.interceptor';
import { LandingComponent } from './features/landing/landing.component';
import { LandingBrandsComponent } from './features/landing/landing-brands/landing-brands.component';
import { LandingAboutUsComponent } from './features/landing/landing-about-us/landing-about-us.component';
import { NyuszkoShopModule } from './features/nyuszko-shop/nyuszko-shop.module';
import { MasniShopModule } from './features/masni-shop/masni-shop.module';
import { ContactComponent } from './features/contact/contact.component';
import { SharedModule } from './shared/shared.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { reducers } from './reducer';
import { ShopComponent } from './features/shop/shop.component';
import { PrivacyPolicyComponent } from './features/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './features/terms-and-conditions/terms-and-conditions.component';
import { EffectsModule } from '@ngrx/effects';
import { AuthService } from '@core/services/auth.service';
import {
  CategoryEffects,
  MaterialEffects,
  ShoppingCartEffects,
  UserEffects
} from '@core/store/effects';
import { ProductEffects } from '@core/store/effects/product.effects';
import { AuthModule } from './features/auth/auth.module';
import { UserProfileComponent } from './features/user-profile/user-profile.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OrderEffects } from '@core/store/effects/order.effects';

const PRIME_NG = [
  AccordionModule,
  CarouselModule,
  InputTextModule,
  InputTextareaModule,
  DividerModule,
  InputSwitchModule,
  ButtonModule,
  ToastModule,
  ConfirmDialogModule,
  BadgeModule,
  SelectButtonModule,
  ChipsModule,
  DropdownModule,
  CardModule
];

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    LandingBrandsComponent,
    LandingAboutUsComponent,
    ContactComponent,
    ShopComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    SharedModule,
    NyuszkoShopModule,
    MasniShopModule,
    AuthModule,
    HttpClientModule,
    ImageModule,
    MatSnackBarModule,
    ...PRIME_NG,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),
    EffectsModule.forRoot([
      MaterialEffects,
      ShoppingCartEffects,
      ProductEffects,
      CategoryEffects,
      UserEffects,
      OrderEffects
    ]),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AuthService],
      useFactory: (auth: AuthService) => {
        return () => {
          auth.autoAuthentication();
        };
      }
    },
    AuthInterceptorProvider,
    HttpInterceptorProvider,
    MessageService,
    ConfirmationService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
