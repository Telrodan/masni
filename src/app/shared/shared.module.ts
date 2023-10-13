import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { CarouselModule } from 'primeng/carousel';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';

import { ProductCardComponent } from './components/product-card/product-card.component';
import { ImageCompositionComponent } from './components/image-composition/image-composition.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ScrollableImageWithTitleComponent } from './components/scrollable-image-with-title/scrollable-image-with-title.component';
import { ProductsCarouselComponent } from './components/products-carousel/products-carousel.component';
import { ProductCategoriesCarouselComponent } from './components/product-categories-carousel/product-categories-carousel.component';
import { MaterialCarouselComponent } from './components/material-carousel/material-carousel.component';

const PRIME_NG = [CarouselModule, RippleModule, ButtonModule, SkeletonModule];

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    ProductCardComponent,
    ImageCompositionComponent,
    SpinnerComponent,
    ScrollableImageWithTitleComponent,
    ProductsCarouselComponent,
    ProductCategoriesCarouselComponent,
    MaterialCarouselComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    ...PRIME_NG
  ],
  exports: [
    ConfirmDialogComponent,
    ProductCardComponent,
    ImageCompositionComponent,
    SpinnerComponent,
    ScrollableImageWithTitleComponent,
    ProductsCarouselComponent,
    ProductCategoriesCarouselComponent,
    MaterialCarouselComponent
  ]
})
export class SharedModule {}
