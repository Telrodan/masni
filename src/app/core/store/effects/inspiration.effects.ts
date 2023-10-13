import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, exhaustMap, catchError, of } from 'rxjs';
import {
  getInspirations,
  getInspirationsError,
  getInspirationsSuccess
} from '../actions';
import { InspirationService } from '@core/services/inspiration.service';

@Injectable()
export class InspirationEffects {
  constructor(
    private actions$: Actions,
    private inspirationService: InspirationService
  ) {}

  getCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getInspirations),
      exhaustMap(() =>
        this.inspirationService.getInspirations$().pipe(
          map((inspirations) => getInspirationsSuccess({ inspirations })),
          catchError(() => of(getInspirationsError()))
        )
      )
    )
  );
}
