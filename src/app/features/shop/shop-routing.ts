import { Route } from '@angular/router';

const shopComponent = () =>
  import('./shop.component').then((c) => c.ShopComponent);

const productDetailsComponent = () =>
  import('./product-details/product-details.component').then(
    (c) => c.ProductDetailsComponent
  );

export default [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: ':id',
    loadComponent: shopComponent
  },
  {
    path: 'product-details/:id',
    loadComponent: productDetailsComponent
  }
] as Route[];
