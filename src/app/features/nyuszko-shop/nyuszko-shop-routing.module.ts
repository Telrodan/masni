import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NyuszkoShopComponent } from './nyuszko-shop.component';

const routes: Routes = [
  {
    path: '',
    component: NyuszkoShopComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NyuszkoShopRoutingModule {}
