import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccordionModule } from 'primeng/accordion';
import { CarouselModule } from 'primeng/carousel';

import { LandingPageComponent } from './landing-page.component';
import { ProductsCarouselComponent } from '@features/landing-page/components/products-carousel/products-carousel.component';
import { AboutMeComponent } from '@features/landing-page/components/about-me/about-me.component';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

const PRIME_NG = [CarouselModule, AccordionModule];

@NgModule({
  declarations: [
    LandingPageComponent,
    ProductsCarouselComponent,
    AboutMeComponent
  ],
  imports: [CommonModule, LandingPageRoutingModule, SharedModule, ...PRIME_NG]
})
export class LandingPageModule {}
