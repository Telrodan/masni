import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StyleClassModule } from 'primeng/styleclass';
import { CarouselModule } from 'primeng/carousel';
import { RippleModule } from 'primeng/ripple';

import { NavbarComponent } from './UI/navbar/navbar.component';
import { FooterComponent } from './UI/footer/footer.component';
import { ProductCardComponent } from './UI/product-card/product-card.component';
import { CarouselComponent } from './UI/carousel/carousel.component';
import { MenuItemComponent } from './UI/menu-item/menu-item.component';
import { ImageCompositionComponent } from './UI/image-composition/image-composition.component';
import { SpinnerComponent } from './UI/spinner/spinner.component';
import { CarouselWithHeadingAndButtonComponent } from './UI/carousel-with-heading-and-button/carousel-with-heading-and-button.component';
import { ConfirmDialogComponent } from './UI/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ButtonModule } from 'primeng/button';

const PRIME_NG = [CarouselModule, StyleClassModule, RippleModule, ButtonModule];

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    ProductCardComponent,
    CarouselComponent,
    MenuItemComponent,
    ImageCompositionComponent,
    SpinnerComponent,
    CarouselWithHeadingAndButtonComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    ...PRIME_NG
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    ProductCardComponent,
    CarouselComponent,
    MenuItemComponent,
    ImageCompositionComponent,
    SpinnerComponent,
    CarouselWithHeadingAndButtonComponent
  ]
})
export class SharedModule {}
