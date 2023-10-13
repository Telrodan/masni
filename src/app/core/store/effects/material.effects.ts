import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, exhaustMap, catchError, of } from 'rxjs';

import { MaterialService } from '@core/services/material.service';
import {
  getMaterials,
  getMaterialsError,
  getMaterialsSuccess
} from '@core/store/actions';

@Injectable()
export class MaterialEffects {
  constructor(
    private actions$: Actions,
    private materialService: MaterialService
  ) {}

  getMaterials$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getMaterials),
      exhaustMap(() =>
        this.materialService.getMaterials$().pipe(
          map((materials) => getMaterialsSuccess({ materials })),
          catchError(() => of(getMaterialsError()))
        )
      )
    )
  );
}
