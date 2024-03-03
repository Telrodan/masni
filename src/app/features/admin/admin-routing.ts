import { Route } from '@angular/router';

const adminComponent = () =>
  import('./admin.component').then((c) => c.AdminComponent);

const reportsComponentRouting = () =>
  import('./components/reports/reports-routing');

const categoriesComponentRouting = () =>
  import('./components/categories/categories-routing');

const productsComponentRouting = () =>
  import('./components/products/products-routing');

const materialsComponentRouting = () =>
  import('./components/materials/materials-routing');

const inspirationsComponentRouting = () =>
  import('./components/inspirations/inspirations-routing');

const questionsComponentRouting = () =>
  import('./components/questions/questions-routing');

export default [
  {
    path: '',
    loadComponent: adminComponent,
    children: [
      {
        path: '',
        redirectTo: 'reports',
        pathMatch: 'full'
      },
      {
        path: 'reports',
        loadChildren: reportsComponentRouting
      },
      {
        path: 'categories',
        loadChildren: categoriesComponentRouting
      },
      {
        path: 'products',
        loadChildren: productsComponentRouting
      },
      {
        path: 'materials',
        loadChildren: materialsComponentRouting
      },
      {
        path: 'inspirations',
        loadChildren: inspirationsComponentRouting
      },
      {
        path: 'questions',
        loadChildren: questionsComponentRouting
      }
    ]
  }
] as Route[];
