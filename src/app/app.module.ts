import { APP_INITIALIZER, NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
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
import { ToggleButtonModule } from 'primeng/togglebutton';
import { GalleriaModule } from 'primeng/galleria';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ScrollTopModule } from 'primeng/scrolltop';
import { PaginatorModule } from 'primeng/paginator';
import { RadioButtonModule } from 'primeng/radiobutton';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptorProvider } from '@core/interceptors/auth-interceptor';
import { HttpInterceptorProvider } from '@core/interceptors/http.interceptor';
import { AuthService } from '@core/services/auth.service';
import { ProductEffects } from '@core/store/effects/product.effects';
import { OrderEffects } from '@core/store/effects/order.effects';
import {
  CategoryEffects,
  MaterialEffects,
  ShoppingCartEffects,
  UserEffects,
  QuestionEffects,
  InspirationEffects
} from '@core/store/effects';
import { NyuszkoShopModule } from '@features/nyuszko-shop/nyuszko-shop.module';
import { MasniShopModule } from '@features/masni-shop/masni-shop.module';
import { ContactComponent } from '@features/contact/contact.component';
import { ShopComponent } from '@features/shop/shop.component';
import { PrivacyPolicyComponent } from '@features/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from '@features/terms-and-conditions/terms-and-conditions.component';
import { AuthModule } from '@features/auth/auth.module';
import { UserProfileComponent } from '@features/user-profile/user-profile.component';
import { ProductDetailsComponent } from '@features/shop/components/product-details/product-details.component';
import { SamplesComponent } from '@features/samples/samples.component';
import { ShoppingCartComponent } from '@features/shopping-cart/shopping-cart.component';
import { InspirationPageComponent } from '@features/inspiration-page/inspiration-page.component';
import { environment } from 'src/environments/environment';
import { reducers } from './core/store/app-state';
import { SharedModule } from './shared/shared.module';
import { LayoutComponent } from './features/layout/layout.component';
import { NavbarComponent } from '@features/layout/components/navbar/navbar.component';
import { FooterComponent } from '@features/layout/components/footer/footer.component';
import { StyleClassModule } from 'primeng/styleclass';

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
  CardModule,
  CheckboxModule,
  GalleriaModule,
  ToggleButtonModule,
  StyleClassModule,
  ScrollTopModule,
  PaginatorModule,
  RadioButtonModule,
];

const MATERIAL = [MatSnackBarModule, MatDialogModule];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    ContactComponent,
    ShopComponent,
    ProductDetailsComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
    UserProfileComponent,
    SamplesComponent,
    ShoppingCartComponent,
    InspirationPageComponent,
    LayoutComponent
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
    NgxSkeletonLoaderModule,

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
