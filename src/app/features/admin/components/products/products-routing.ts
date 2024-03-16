import { Route } from '@angular/router';

const ProductsComponent = () =>
    import('./products.component').then((c) => c.ProductsComponent);

const AddProductComponent = () =>
    import('./add-product/add-product.component').then(
        (c) => c.AddProductComponent
    );

const EditProductComponent = () =>
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
        loadComponent: ProductsComponent
    },
    {
        path: 'add',
        loadComponent: AddProductComponent
    },
    {
        path: 'edit/:id',
        loadComponent: EditProductComponent
    }
] as Route[];
