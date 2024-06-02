import { inject } from '@angular/core';
import { LogService } from '@core/services/log.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map } from 'rxjs';
import { LogAction } from './log.actions';

export class LogEffects {
    private readonly actions$ = inject(Actions);
    private readonly logService = inject(LogService);

    getLogs$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LogAction.getLogs),
            exhaustMap(() =>
                this.logService.getLogs().pipe(map((logs) => LogAction.getLogsSuccess({ logs })))
            )
        )
    );
}
