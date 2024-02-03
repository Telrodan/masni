import { Route } from '@angular/router';

const productsComponent = () =>
  import('./products.component').then((c) => c.ProductsComponent);

const addProductComponent = () =>
  import('./add-product/add-product.component').then(
    (c) => c.AddProductComponent
  );

const editProductComponent = () =>
  import('./edit-product/edit-product.component').then(
    (c) => c.EditProductComponent
  );

export default [
  {
    path: '',
    redirectTo: 'all',
    pathMatch: 'full'
  },
  {
    path: 'all',
    loadComponent: productsComponent
  },
  {
    path: 'add',
    loadComponent: addProductComponent
  },
  {
    path: 'edit/:id',
    loadComponent: editProductComponent
  }
] as Route[];
