import { Injectable, inject } from '@angular/core';
import { ToastrService } from '@core/services/toastr.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map } from 'rxjs';
import { InspirationAction } from './inspiration.actions';
import { InspirationService } from '@core/services/inspiration.service';
import { Store } from '@ngrx/store';
import { CategoryAction } from '../category';

@Injectable()
export class InspirationEffects {
    private readonly actions$ = inject(Actions);
    private readonly inspirationService = inject(InspirationService);
    private readonly toastr = inject(ToastrService);
    private readonly store = inject(Store);

    addInspiration$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InspirationAction.addInspiration),
            exhaustMap((action) =>
                this.inspirationService.addInspiration$(action.inspiration).pipe(
                    map((inspiration) => {
                        this.toastr.success(`${inspiration.name} inspiráció hozzáadva.`);
                        this.store.dispatch(CategoryAction.getCategories());
                        return InspirationAction.addInspirationSuccess({ inspiration });
                    })
                )
            )
        )
    );

    updateInspiration$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InspirationAction.updateInspiration),
            exhaustMap(({ inspiration }) =>
                this.inspirationService.updateInspiration$(inspiration).pipe(
                    map((updatedInspiration) => {
                        this.toastr.success(`${updatedInspiration.name} inspiráció frissítve.`);
                        this.store.dispatch(CategoryAction.getCategories());
                        return InspirationAction.updateInspirationSuccess({
                            inspiration: updatedInspiration
                        });
                    })
                )
            )
        )
    );

    deleteInspiration$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InspirationAction.deleteInspiration),
            exhaustMap(({ id, name }) =>
                this.inspirationService.deleteInspiration$(id).pipe(
                    map(() => {
                        this.toastr.success(`${name} inspiráció törölve.`);
                        this.store.dispatch(CategoryAction.getCategories());
                        return InspirationAction.deleteInspirationSuccess({
                            id
                        });
                    })
                )
            )
        )
    );

    getInspirations$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InspirationAction.getInspirations),
            exhaustMap(() =>
                this.inspirationService
                    .getInspirations$()
                    .pipe(
                        map((inspirations) =>
                            InspirationAction.getInspirationsSuccess({ inspirations })
                        )
                    )
            )
        )
    );
}
