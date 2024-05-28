import { Injectable, inject } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, exhaustMap } from 'rxjs';

import { CategoryService } from '@core/services/category.service';
import { CategoryAction } from './category.actions';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class CategoryEffects {
    private readonly toastr = inject(ToastrService);
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

    getNavbarMenu$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CategoryAction.getNavbarMenu),
            exhaustMap(() =>
                this.categoryService
                    .getNavbarMenu$()
                    .pipe(map((navbarMenu) => CategoryAction.getNavbarMenuSuccess({ navbarMenu })))
            )
        )
    );

    addCategory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CategoryAction.addCategory),
            exhaustMap((action) =>
                this.categoryService.addCategory$(action.category).pipe(
                    map((category) => {
                        this.toastr.success(`${category.name} kategória hozzáadva.`);
                        return CategoryAction.addCategorySuccess({ category });
                    })
                )
            )
        )
    );

    updateCategory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CategoryAction.updateCategory),
            exhaustMap((action) =>
                this.categoryService.updateCategory$(action.category).pipe(
                    map((category) => {
                        this.toastr.success(`${category.name} kategória frissítve.`);
                        return CategoryAction.updateCategorySuccess({ category });
                    })
                )
            )
        )
    );

    updateCategoriesOrder$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CategoryAction.updateCategoriesOrder),
            exhaustMap((action) =>
                this.categoryService.updateCategoriesOrder$(action.categoryOrderData).pipe(
                    map((categories) => {
                        this.toastr.success(
                            `${
                                action.categoryOrderData.isSubCategory
                                    ? 'Alkategóriák'
                                    : 'Főkategóriák'
                            } sorrendje frissítve.`
                        );
                        return CategoryAction.updateCategoriesOrderSuccess({ categories });
                    })
                )
            )
        )
    );

    deleteCategory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CategoryAction.deleteCategory),
            exhaustMap((action) =>
                this.categoryService.deleteCategory$(action.id).pipe(
                    map(() => {
                        this.toastr.success(`${action.name} kategória törölve.`);
                        return CategoryAction.deleteCategorySuccess({ id: action.id });
                    })
                )
            )
        )
    );
}
