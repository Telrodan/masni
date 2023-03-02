import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as fromCore from './core-ngrx/reducers/core.reducers';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromCore.coreFeatureKey, fromCore.coreReducer)
  ]
})
export class CoreModule {}
