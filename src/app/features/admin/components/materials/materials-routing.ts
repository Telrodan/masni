import { Route } from '@angular/router';

const MaterialsComponent = () =>
    import('./materials.component').then((m) => m.MaterialsComponent);

const AddMaterialComponent = () =>
    import('./add-material/add-material.component').then(
        (m) => m.AddMaterialComponent
    );

const EditMaterialComponent = () =>
    import('./edit-material/edit-material.component').then(
        (m) => m.EditMaterialComponent
    );

export default [
    {
        path: '',
        redirectTo: 'all',
        pathMatch: 'full'
    },
    {
        path: 'all',
        loadComponent: MaterialsComponent
    },
    {
        path: 'add',
        loadComponent: AddMaterialComponent
    },
    {
        path: 'edit/:id',
        loadComponent: EditMaterialComponent
    }
] as Route[];
