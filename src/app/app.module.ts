import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './features/landing/landing.component';
import { LandingBrandsComponent } from './features/landing/landing-brands/landing-brands.component';
import { LandingAboutUsComponent } from './features/landing/landing-about-us/landing-about-us.component';
import { LandingContactUsComponent } from './features/landing/landing-contact-us/landing-contact-us.component';
import { NyuszkoShopModule } from './features/nyuszko-shop/nyuszko-shop.module';
import { MasniShopModule } from './features/masni-shop/masni-shop.module';
import { AboutUsComponent } from './features/about-us/about-us.component';
import { ContactComponent } from './features/contact/contact.component';
import { HttpClientModule } from '@angular/common/http';
import { ImageModule } from 'primeng/image';
import { ReadyProductsComponent } from './features/ready-products/ready-products.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    LandingBrandsComponent,
    LandingAboutUsComponent,
    LandingContactUsComponent,
    AboutUsComponent,
    ContactComponent,
    ReadyProductsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FontAwesomeModule,
    SharedModule,
    NyuszkoShopModule,
    MasniShopModule,
    HttpClientModule,
    ImageModule
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
