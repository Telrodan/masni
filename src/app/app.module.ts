import { APP_INITIALIZER, NgModule, isDevMode } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ServiceWorkerModule } from '@angular/service-worker';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ScrollTopModule } from 'primeng/scrolltop';
import { StyleClassModule } from 'primeng/styleclass';

import { AuthInterceptorProvider } from '@core/interceptors/auth-interceptor';
import { HttpInterceptorProvider } from '@core/interceptors/http.interceptor';
import { AuthService } from '@core/services/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from '@features/layout/components/navbar/navbar.component';
import { FooterComponent } from '@features/layout/components/footer/footer.component';
import { environment } from 'src/environments/environment';
import { reducers } from './core/store/app-state';
import { LayoutComponent } from './features/layout/layout.component';
import {
  CategoryEffects,
  MaterialEffects,
  ShoppingCartEffects,
  UserEffects,
  QuestionEffects,
  InspirationEffects,
  ProductEffects,
  OrderEffects
} from '@core/store/effects';
import { SharedModule } from '@shared/shared.module';

const PRIME_NG = [ToastModule, StyleClassModule, ScrollTopModule];

const MATERIAL = [MatSnackBarModule, MatDialogModule];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    ...MATERIAL,
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
      OrderEffects,
      InspirationEffects,
      QuestionEffects
    ]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
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
