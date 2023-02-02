import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StyleClassModule } from 'primeng/styleclass';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { MenuModule } from 'primeng/menu';
import { ImageModule } from 'primeng/image';

import { NavbarComponent } from './UI/navbar/navbar.component';
import { FooterComponent } from './UI/footer/footer.component';
import { PostCardComponent } from './UI/post-card/post-card.component';
import { ProductCardComponent } from './UI/product-card/product-card.component';
import { FeaturedProductsComponent } from './UI/featured-products/featured-products.component';
import { RecentNewsComponent } from './UI/recent-news/recent-news.component';
import { CarouselComponent } from './UI/carousel/carousel.component';
import { MenuItemComponent } from './UI/menu-item/menu-item.component';
import { ProductDetailsComponent } from './UI/product-details/product-details.component';
import { ProductPickerComponent } from './UI/product-picker/product-picker.component';
import { SamplesComponent } from './UI/samples/samples.component';
import { ImageCompositionComponent } from './UI/image-composition/image-composition.component';
import { SpinnerComponent } from './UI/spinner/spinner.component';
import { CarouselWithHeadingAndButtonComponent } from './UI/carousel-with-heading-and-button/carousel-with-heading-and-button.component';

const PRIME_NG = [
  CarouselModule,
  StyleClassModule,
  ButtonModule,
  RippleModule,
  MenuModule,
  ImageModule
];

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    PostCardComponent,
    ProductCardComponent,
    FeaturedProductsComponent,
    RecentNewsComponent,
    CarouselComponent,
    MenuItemComponent,
    ProductDetailsComponent,
    ProductPickerComponent,
    SamplesComponent,
    ImageCompositionComponent,
    SpinnerComponent,
    CarouselWithHeadingAndButtonComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    ReactiveFormsModule,
    ...PRIME_NG
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    PostCardComponent,
    ProductCardComponent,
    FeaturedProductsComponent,
    RecentNewsComponent,
    CarouselComponent,
    MenuItemComponent,
    ProductDetailsComponent,
    ProductPickerComponent,
    SamplesComponent,
    ImageCompositionComponent,
    SpinnerComponent,
    CarouselWithHeadingAndButtonComponent
  ]
})
export class SharedModule {}
