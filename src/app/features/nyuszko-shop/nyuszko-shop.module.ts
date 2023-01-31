import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NyuszkoShopRoutingModule } from './nyuszko-shop-routing.module';
import { NyuszkoShopComponent } from './nyuszko-shop.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NyuszkoBuilderComponent } from './nyuszko-builder/nyuszko-builder.component';

@NgModule({
  declarations: [NyuszkoShopComponent, NyuszkoBuilderComponent],
  imports: [
    CommonModule,
    SharedModule,
    NyuszkoShopRoutingModule,
    ReactiveFormsModule
  ]
})
export class NyuszkoShopModule {}
