import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MackoBuilderComponent } from './macko-builder/macko-builder.component';
import { MackoSzundikendoBuilderComponent } from './macko-szundikendo-builder/macko-szundikendo-builder.component';
import { NyuszkoBuilderComponent } from './nyuszko-builder/nyuszko-builder.component';

import { NyuszkoShopComponent } from './nyuszko-shop.component';
import { NyuszkoSzundikendoBuilderComponent } from './nyuszko-szundikendo-builder/nyuszko-szundikendo-builder.component';

const routes: Routes = [
  {
    path: '',
    component: NyuszkoShopComponent
  },
  {
    path: 'nyuszko',
    component: NyuszkoBuilderComponent
  },
  {
    path: 'nyuszko-szundikendo',
    component: NyuszkoSzundikendoBuilderComponent
  },
  {
    path: 'macko',
    component: MackoBuilderComponent
  },
  {
    path: 'macko-szundikendo',
    component: MackoSzundikendoBuilderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NyuszkoShopRoutingModule {}
