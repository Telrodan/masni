import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasniShopComponent } from './masni-shop.component';

const routes: Routes = [
  {
    path: '',
    component: MasniShopComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasniShopRoutingModule {}
