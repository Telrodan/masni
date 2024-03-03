import { Route } from '@angular/router';

const inspirationsComponent = () =>
  import('./inspirations.component').then((m) => m.InspirationsComponent);

const addInspirationComponent = () =>
  import('./add-inspiration/add-inspiration.component').then(
    (m) => m.AddInspirationComponent
  );

const editInspirationComponent = () =>
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
    loadComponent: inspirationsComponent
  },
  {
    path: 'add',
    loadComponent: addInspirationComponent
  },
  {
    path: 'edit/:id',
    loadComponent: editInspirationComponent
  }
] as Route[];
