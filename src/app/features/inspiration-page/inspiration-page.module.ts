import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspirationPageRoutingModule } from './inspiration-page-routing.module';
import { InspirationPageComponent } from './inspiration-page.component';
import { GalleriaModule } from 'primeng/galleria';
import { SharedModule } from '@shared/shared.module';
import { SkeletonModule } from 'primeng/skeleton';

const PRIME_NG = [GalleriaModule, SkeletonModule];

@NgModule({
  declarations: [InspirationPageComponent],
  imports: [
    CommonModule,
    InspirationPageRoutingModule,
    SharedModule,
    ...PRIME_NG
  ]
})
export class InspirationPageModule {}
