import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './components/reports/reports.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { OrderDetailsComponent } from './components/orders/components/order-details/order-details.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { AdminComponent } from './admin.component';
import { MaterialsComponent } from './components/materials/materials.component';
import { InspirationsComponent } from './components/inspirations/inspirations.component';
import { ProductsComponent } from './components/products/products.component';
import { OrdersComponent } from './components/orders/orders.component';
import { UsersComponent } from './components/users/users.component';

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
        path: 'orders',
        component: OrdersComponent
      },
      {
        path: 'users',
        component: UsersComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
