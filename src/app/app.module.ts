import { APP_INITIALIZER, NgModule, isDevMode } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ServiceWorkerModule } from '@angular/service-worker';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ScrollTopModule } from 'primeng/scrolltop';

import { AuthInterceptorProvider } from '@core/interceptors/auth-interceptor';
import { HttpInterceptorProvider } from '@core/interceptors/http.interceptor';
import { AuthService } from '@core/services/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { LayoutComponent } from './features/layout/layout.component';

import { SharedModule } from '@shared/shared.module';

const PRIME_NG = [ToastModule, ScrollTopModule];

const MATERIAL = [MatSnackBarModule, MatDialogModule];

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        SharedModule,
        LayoutComponent,
        ...MATERIAL,
        ...PRIME_NG,
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
