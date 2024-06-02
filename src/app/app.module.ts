import { APP_INITIALIZER, NgModule, isDevMode } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ServiceWorkerModule } from '@angular/service-worker';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ToastrModule } from 'ngx-toastr';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AuthInterceptorProvider } from '@core/interceptors/auth-interceptor';
import { HttpInterceptorProvider } from '@core/interceptors/http.interceptor';
import { AuthService } from '@core/services/auth.service';
import { SharedModule } from '@shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './features/layout/layout.component';
import { environment } from 'src/environments/environment';
import { appState } from '@core/store/app-state';
import { CategoryEffects } from '@core/store/category';
import { SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { MaterialEffects } from '@core/store/material/material.effects';
import { LogEffects } from '@core/store/log/log.effects';
import { InspirationEffects } from '@core/store/inspiration';
import { ProductEffects } from '@core/store/product';

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
        ScrollTopModule,
        SocialLoginModule,
        ...MATERIAL,
        StoreModule.forRoot(appState),
        EffectsModule.forRoot([
            CategoryEffects,
            ProductEffects,
            MaterialEffects,
            LogEffects,
            InspirationEffects
        ]),
        ToastrModule.forRoot(),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: environment.production
        }),
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
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(
                            '192518032879-mrgpr1b7fekcvnnnlhrc86s22b90argc.apps.googleusercontent.com'
                        )
                    }
                ],
                onError: (error) => {
                    console.error(error);
                }
            } as SocialAuthServiceConfig
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
