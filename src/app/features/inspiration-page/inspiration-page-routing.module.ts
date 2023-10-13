import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InspirationPageComponent } from './inspiration-page.component';

const routes: Routes = [
  {
    path: '',
    component: InspirationPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspirationPageRoutingModule {}
