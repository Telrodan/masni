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

const PRIME_NG = [ImageModule, CheckboxModule, DropdownModule, PaginatorModule];

@NgModule({
  declarations: [ShopComponent, ProductDetailsComponent],
  imports: [
    CommonModule,
    ShopRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ...PRIME_NG
  ]
})
export class ShopModule {}
