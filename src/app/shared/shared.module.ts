import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from './UI/navbar/navbar.component';
import { FooterComponent } from './UI/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PostCardComponent } from './UI/post-card/post-card.component';
import { ProductCardComponent } from './UI/product-card/product-card.component';
import { FeaturedProductsComponent } from './UI/featured-products/featured-products.component';
import { RecentNewsComponent } from './UI/recent-news/recent-news.component';
import { CarouselComponent } from './UI/carousel/carousel.component';
import { CarouselModule } from 'primeng/carousel';

const PRIME_NG = [CarouselModule];

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    PostCardComponent,
    ProductCardComponent,
    FeaturedProductsComponent,
    RecentNewsComponent,
    CarouselComponent
  ],
  imports: [CommonModule, FontAwesomeModule, ...PRIME_NG],
  exports: [
    NavbarComponent,
    FooterComponent,
    PostCardComponent,
    ProductCardComponent,
    FeaturedProductsComponent,
    RecentNewsComponent,
    CarouselComponent
  ]
})
export class SharedModule {}
