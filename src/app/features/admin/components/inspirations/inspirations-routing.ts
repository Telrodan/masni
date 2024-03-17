import { Route } from '@angular/router';

const InspirationsComponent = () =>
    import('./inspirations.component').then((m) => m.InspirationsComponent);

const AddInspirationComponent = () =>
    import('./add-inspiration/add-inspiration.component').then(
        (m) => m.AddInspirationComponent
    );

const EditInspirationComponent = () =>
    import('./edit-inspiration/edit-inspiration.component').then(
        (m) => m.EditInspirationComponent
    );

export default [
    {
        path: '',
        redirectTo: 'all',
        pathMatch: 'full'
    },
    {
        path: 'all',
        loadComponent: InspirationsComponent
    },
    {
        path: 'add',
        loadComponent: AddInspirationComponent
    },
    {
        path: 'edit/:id',
        loadComponent: EditInspirationComponent
    }
] as Route[];
