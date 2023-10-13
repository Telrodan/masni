import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialPageRoutingModule } from './material-page-routing.module';
import { MaterialPageComponent } from './material-page.component';
import { GalleriaModule } from 'primeng/galleria';
import { SharedModule } from '@shared/shared.module';
import { SkeletonModule } from 'primeng/skeleton';

const PRIME_NG = [GalleriaModule, SkeletonModule];

@NgModule({
  declarations: [MaterialPageComponent],
  imports: [CommonModule, MaterialPageRoutingModule, SharedModule, ...PRIME_NG]
})
export class MaterialPageModule {}
