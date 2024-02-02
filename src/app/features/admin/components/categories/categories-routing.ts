import { Route } from '@angular/router';

const categoriesComponent = () =>
  import('./categories.component').then((c) => c.CategoriesComponent);

const addCategoryComponent = () =>
  import('./add-category/add-category.component').then(
    (c) => c.AddCategoryComponent
  );

const editCategoryComponent = () =>
  import('./edit-category/edit-category.component').then(
    (c) => c.EditCategoryComponent
  );

const orderCategoriesComponent = () =>
  import('./order-categories/order-categories.component').then(
    (c) => c.OrderCategoriesComponent
  );

export default [
  {
    path: '',
    redirectTo: 'all',
    pathMatch: 'full'
  },
  {
    path: 'all',
    loadComponent: categoriesComponent
  },
  {
    path: 'add',
    loadComponent: addCategoryComponent
  },
  {
    path: 'edit/:id',
    loadComponent: editCategoryComponent
  },
  {
    path: 'order',
    loadComponent: orderCategoriesComponent
  }
] as Route[];
