import { Route } from '@angular/router';

const materialsComponent = () =>
  import('./materials.component').then((m) => m.MaterialsComponent);
const addMaterialComponent = () =>
  import('./add-material/add-material.component').then(
    (m) => m.AddMaterialComponent
  );
const editMaterialComponent = () =>
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
    loadComponent: materialsComponent
  },
  {
    path: 'add',
    loadComponent: addMaterialComponent
  },
  {
    path: 'edit/:id',
    loadComponent: editMaterialComponent
  }
] as Route[];
