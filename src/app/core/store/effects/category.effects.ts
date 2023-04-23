import { Injectable } from '@angular/core';
import { CategoryService } from '@core/services/category.service';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, exhaustMap } from 'rxjs';
import { getCategories, getCategoriesSuccess } from '../actions';

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
        this.categoryService
          .getCategories$()
          .pipe(map((categories) => getCategoriesSuccess({ categories })))
      )
    )
  );
}
