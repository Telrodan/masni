import { APP_INITIALIZER, NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './core/interceptors/auth-interceptor';
import { HTTPInterceptor } from './core/interceptors/http.interceptor';
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
import { MaterialEffects, ShoppingCartEffects } from '@core/store/effects';
import { ProductEffects } from '@core/store/effects/product.effects';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthModule } from './features/auth/auth.module';

const PRIME_NG = [
  AccordionModule,
  CarouselModule,
  InputTextModule,
  InputSwitchModule,
  ButtonModule,
  ToastModule,
  ConfirmDialogModule,
  CheckboxModule
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
    TermsAndConditionsComponent
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
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([
      MaterialEffects,
      ShoppingCartEffects,
      ProductEffects
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
    MessageService,
    ConfirmationService,

    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HTTPInterceptor, multi: true },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
