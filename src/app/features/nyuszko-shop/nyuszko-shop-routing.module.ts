import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MackoBuilderComponent } from './macko-builder/macko-builder.component';
import { NyuszkoBuilderComponent } from './nyuszko-builder/nyuszko-builder.component';

import { NyuszkoShopComponent } from './nyuszko-shop.component';
import { NyuszkoSzundikendoBuilderComponent } from './nyuszko-szundikendo-builder/nyuszko-szundikendo-builder.component';

const routes: Routes = [
  {
    path: '',
    component: NyuszkoShopComponent
  },
  {
    path: 'nyuszkok',
    component: NyuszkoBuilderComponent
  },
  {
    path: 'nyuszko-szundikendok',
    component: NyuszkoSzundikendoBuilderComponent
  },
  {
    path: 'mackok',
    component: MackoBuilderComponent
  },
  {
    path: 'macko-szundikendok',
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NyuszkoShopRoutingModule {}
