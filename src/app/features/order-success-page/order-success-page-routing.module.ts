import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderSuccessPageComponent } from './order-success-page.component';

const routes: Routes = [
  {
    path: ':id',
    component: OrderSuccessPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderSuccessPageRoutingModule {}
