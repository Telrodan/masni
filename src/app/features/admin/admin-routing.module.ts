import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllProductComponent } from './components/all-product/all-product.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductComponent } from './components/product/product.component';
import { ReportsComponent } from './components/reports/reports.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
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
        path: 'add-product',
        component: ProductComponent
      },
      {
        path: 'products',
        component: AllProductComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
