import { Injectable } from '@angular/core';
import { CategoryService } from '@core/services/category.service';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, exhaustMap, catchError, of } from 'rxjs';
import {
  getCategories,
  getCategoriesError,
  getCategoriesSuccess
} from '../actions';

@Injectable()
export class CategoryEffects {
  constructor(
    private actions$: Actions,
    private categoryService: CategoryService
  ) {}

  getCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getCategories),
      exhaustMap(() =>
        this.categoryService.getCategories$().pipe(
          map((categories) => getCategoriesSuccess({ categories })),
          catchError(() => of(getCategoriesError()))
        )
      )
    )
  );
}
