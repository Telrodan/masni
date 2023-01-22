import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasniShopRoutingModule } from './masni-shop-routing.module';
import { MasniShopComponent } from './masni-shop.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [MasniShopComponent],
  imports: [CommonModule, SharedModule, MasniShopRoutingModule]
})
export class MasniShopModule {}
