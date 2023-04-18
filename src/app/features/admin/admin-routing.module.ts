import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './components/reports/reports.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { AdminComponent } from './admin.component';
import { AddMaterialComponent } from './components/add-material/add-material.component';
import { MaterialListComponent } from './components/material-list/material-list.component';
import { AddInspirationComponent } from './components/add-inspiration/add-inspiration.component';
import { InspirationListComponent } from './components/inspiration-list/inspiration-list.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: ReportsComponent
      },
      {
        path: 'categories',
        component: CategoriesComponent
      },
      {
        path: 'add-material',
        component: AddMaterialComponent
      },
      {
        path: 'materials',
        component: MaterialListComponent
      },
      {
        path: 'add-inspiration',
        component: AddInspirationComponent
      },
      {
        path: 'inspirations',
        component: InspirationListComponent
      },
      {
        path: 'add-product',
        component: AddProductComponent
      },
      {
        path: 'products',
        component: ProductListComponent
      },
      {
        path: 'users',
        component: UserListComponent
      },
      {
        path: 'orders',
        component: OrderListComponent
      },
      {
        path: 'order-details/:id',
        component: OrderDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
