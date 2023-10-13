import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MaterialPageComponent } from './material-page.component';

const routes: Routes = [
  {
    path: '',
    component: MaterialPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialPageRoutingModule {}
