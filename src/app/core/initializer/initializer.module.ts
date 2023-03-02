import { NgModule, APP_INITIALIZER } from '@angular/core';

import { MaterialService } from '../services/material.service';

@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (materials: MaterialService) => {
        return () => {
          materials.getMaterials$().subscribe();
        };
      },
      deps: [MaterialService]
    }
  ]
})
export class InitializerModule {}
