import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CarouselModule } from 'primeng/carousel';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';

import { ProductCardComponent } from './UI/product-card/product-card.component';
import { CarouselComponent } from './UI/carousel/carousel.component';
import { MenuItemComponent } from './UI/menu-item/menu-item.component';
import { ImageCompositionComponent } from './UI/image-composition/image-composition.component';
import { SpinnerComponent } from './UI/spinner/spinner.component';
import { CarouselWithHeadingAndButtonComponent } from './UI/carousel-with-heading-and-button/carousel-with-heading-and-button.component';
import { ConfirmDialogComponent } from './UI/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ButtonModule } from 'primeng/button';
import { OrderSuccessComponent } from './UI/order-success/order-success.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CarouselItemComponent } from './UI/carousel-with-heading-and-button/components/carousel-item/carousel-item.component';

const PRIME_NG = [CarouselModule, RippleModule, ButtonModule, SkeletonModule];

@NgModule({
  declarations: [
    ProductCardComponent,
    CarouselComponent,
    MenuItemComponent,
    ImageCompositionComponent,
    SpinnerComponent,
    CarouselWithHeadingAndButtonComponent,
    ConfirmDialogComponent,
    OrderSuccessComponent,
    CarouselItemComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxSkeletonLoaderModule,
    ...PRIME_NG
  ],
  exports: [
    ProductCardComponent,
    CarouselComponent,
    MenuItemComponent,
    ImageCompositionComponent,
    SpinnerComponent,
    CarouselWithHeadingAndButtonComponent
  ]
})
export class SharedModule {}
