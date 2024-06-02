import { Injectable, inject } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map } from 'rxjs';

import { MaterialService } from '@core/services/material.service';
import { ToastrService } from '@core/services/toastr.service';
import { MaterialAction } from './material.actions';
import { CategoryAction } from '../category';

@Injectable()
export class MaterialEffects {
    private readonly actions$ = inject(Actions);
    private readonly materialService = inject(MaterialService);
    private readonly toastr = inject(ToastrService);
    private readonly store = inject(Store);

    addMaterial$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MaterialAction.addMaterial),
            exhaustMap(({ material }) =>
                this.materialService.addMaterial$(material).pipe(
                    map((addedMaterial) => {
                        this.toastr.success(`${addedMaterial.name} minta hozzáadva.`);
                        this.store.dispatch(CategoryAction.getCategories());
                        return MaterialAction.addMaterialSuccess({ material: addedMaterial });
                    })
                )
            )
        )
    );

    updateMaterial$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MaterialAction.updateMaterial),
            exhaustMap(({ material }) =>
                this.materialService.updateMaterial$(material).pipe(
                    map((updatedMaterial) => {
                        this.toastr.success(`${updatedMaterial.name} minta frissítve.`);
                        this.store.dispatch(CategoryAction.getCategories());
                        return MaterialAction.updateMaterialSuccess({ material: updatedMaterial });
                    })
                )
            )
        )
    );

    deleteMaterial$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MaterialAction.deleteMaterial),
            exhaustMap(({ id, name }) =>
                this.materialService.deleteMaterial$(id).pipe(
                    map(() => {
                        this.toastr.success(`${name} minta törölve.`);
                        this.store.dispatch(CategoryAction.getCategories());
                        return MaterialAction.deleteMaterialSuccess({ id });
                    })
                )
            )
        )
    );

    getMaterials$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MaterialAction.getMaterials),
            exhaustMap(() =>
                this.materialService
                    .getMaterials$()
                    .pipe(map((materials) => MaterialAction.getMaterialsSuccess({ materials })))
            )
        )
    );
}
