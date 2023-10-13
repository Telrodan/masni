import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderSuccessPageRoutingModule } from './order-success-page-routing.module';
import { OrderSuccessPageComponent } from './order-success-page.component';

@NgModule({
  declarations: [OrderSuccessPageComponent],
  imports: [CommonModule, OrderSuccessPageRoutingModule]
})
export class OrderSuccessPageModule {}
