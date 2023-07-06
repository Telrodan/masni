import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './components/reports/reports.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { OrderDetailsComponent } from './components/order/order-details/order-details.component';
import { OrderListComponent } from './components/order/order-list/order-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { AdminComponent } from './admin.component';
import { MaterialsComponent } from './components/materials/materials.component';
import { InspirationsComponent } from './components/inspirations/inspirations.component';
import { ProductsComponent } from './components/products/products.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'reports',
        pathMatch: 'full'
      },
      {
        path: 'reports',
        component: ReportsComponent
      },
      {
        path: 'categories',
        component: CategoriesComponent
      },
      {
        path: 'materials',
        component: MaterialsComponent
      },
      {
        path: 'inspirations',
        component: InspirationsComponent
      },
      {
        path: 'products',
        component: ProductsComponent
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
