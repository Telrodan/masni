import { Route } from '@angular/router';

const CategoriesComponent = () =>
    import('./categories.component').then((c) => c.CategoriesComponent);

const AddCategoryComponent = () =>
    import('./add-category/add-category.component').then(
        (c) => c.AddCategoryComponent
    );

const EditCategoryComponent = () =>
    import('./edit-category/edit-category.component').then(
        (c) => c.EditCategoryComponent
    );

const OrderCategoriesComponent = () =>
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
        loadComponent: CategoriesComponent
    },
    {
        path: 'add',
        loadComponent: AddCategoryComponent
    },
    {
        path: 'edit/:id',
        loadComponent: EditCategoryComponent
    },
    {
        path: 'order',
        loadComponent: OrderCategoriesComponent
    }
] as Route[];
