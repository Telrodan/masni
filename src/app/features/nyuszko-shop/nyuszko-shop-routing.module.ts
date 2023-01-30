import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from 'src/app/shared/UI/product-details/product-details.component';
import { ProductPickerComponent } from 'src/app/shared/UI/product-picker/product-picker.component';

import { NyuszkoShopComponent } from './nyuszko-shop.component';

const routes: Routes = [
  {
    path: '',
    component: NyuszkoShopComponent
  },
  {
    path: 'nyuszkok',
    children: [
      {
        path: '',
        component: ProductDetailsComponent
      },
      {
        path: 'vasarlas',
        component: ProductPickerComponent
      }
    ]
  },
  {
    path: 'nyuszko-szundikendok',
    children: [
      {
        path: '',
        component: ProductDetailsComponent
      },
      {
        path: 'vasarlas',
        component: ProductPickerComponent
      }
    ]
  },
  {
    path: 'mackok',
    children: [
      {
        path: '',
        component: ProductDetailsComponent
      },
      {
        path: 'vasarlas',
        component: ProductPickerComponent
      }
    ]
  },
  {
    path: 'macko-szundikendok',
    children: [
      {
        path: '',
        component: ProductDetailsComponent
      },
      {
        path: 'vasarlas',
        component: ProductPickerComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NyuszkoShopRoutingModule {}
