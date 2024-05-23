import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, exhaustMap } from 'rxjs';

import { CategoryService } from '@core/services/category.service';
import { CategoryAction } from './category.actions';

@Injectable()
export class CategoryEffects {
    constructor(private actions$: Actions, private categoryService: CategoryService) {}

    getCategories$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CategoryAction.getCategories),
            exhaustMap(() =>
                this.categoryService
                    .getCategories$()
                    .pipe(map((categories) => CategoryAction.getCategoriesSuccess({ categories })))
            )
        )
    );

    deleteCategory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CategoryAction.deleteCategory),
            exhaustMap((action) =>
                this.categoryService
                    .deleteCategory$(action.categoryId)
                    .pipe(map((categories) => CategoryAction.getCategoriesSuccess({ categories })))
            )
        )
    );
}
