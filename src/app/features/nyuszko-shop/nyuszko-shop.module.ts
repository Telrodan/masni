import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NyuszkoShopRoutingModule } from './nyuszko-shop-routing.module';
import { NyuszkoShopComponent } from './nyuszko-shop.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [NyuszkoShopComponent],
  imports: [CommonModule, SharedModule, NyuszkoShopRoutingModule]
})
export class NyuszkoShopModule {}
