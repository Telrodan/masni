import { createAction, props } from '@ngrx/store';
import { Log } from './log.model';

const ACTION_PREFIX = '[Log]';

export const LogAction = {
    getLogs: createAction(`${ACTION_PREFIX} Get Logs`),

    getLogsSuccess: createAction(`${ACTION_PREFIX} Get Logs Success`, props<{ logs: Log[] }>())
};
