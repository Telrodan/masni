import { Injectable } from '@angular/core';
import { MaterialService } from '@core/services/material.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  filter,
  switchMap,
  tap,
  map,
  mergeMap,
  Observable,
  exhaustMap
} from 'rxjs';
import { getMaterials, getMaterialsSuccess } from '@core/store/actions';
import { MaterialsStateInterface } from '../models/materials-state.model';

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
        this.materialService
          .getMaterials()
          .pipe(map((materials) => getMaterialsSuccess({ materials })))
      )
    )
  );
}
