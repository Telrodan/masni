import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { CarouselModule } from 'primeng/carousel';
import { ImageModule } from 'primeng/image';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

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
import { SignupComponent } from './features/auth/signup/signup.component';
import { LoginComponent } from './features/auth/login/login.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { SharedModule } from './shared/shared.module';

const PRIME_NG = [
  AccordionModule,
  CarouselModule,
  InputTextModule,
  InputSwitchModule,
  ButtonModule,
  ToastModule
];

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    LandingBrandsComponent,
    LandingAboutUsComponent,
    ContactComponent,
    SignupComponent,
    LoginComponent,
    ForgotPasswordComponent
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
    HttpClientModule,
    ImageModule,
    MatSnackBarModule,
    ...PRIME_NG
  ],
  providers: [
    MessageService,
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
