import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from './shop.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ImageModule } from 'primeng/image';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DollDressDialogComponent } from './components/doll-dress-dialog/doll-dress-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ButtonModule } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { SkeletonModule } from 'primeng/skeleton';

const MATERIAL = [MatDialogModule];

const PRIME_NG = [
  ImageModule,
  CheckboxModule,
  DropdownModule,
  PaginatorModule,
  InputTextModule,
  InputTextareaModule,
  ButtonModule,
  GalleriaModule,
  SkeletonModule
];

@NgModule({
  declarations: [
    ShopComponent,
    ProductDetailsComponent,
    DollDressDialogComponent
  ],
  imports: [
    CommonModule,
    ShopRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ...PRIME_NG,
    ...MATERIAL
  ]
})
export class ShopModule {}
