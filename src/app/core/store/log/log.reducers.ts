import { createReducer, on } from '@ngrx/store';
import { LogAction } from './log.actions';

export const logInitialState = {
    logs: [],
    isBusy: false
};

export const logReducers = createReducer(
    logInitialState,
    on(LogAction.getLogs, (state) => ({
        ...state,
        isBusy: true
    })),

    on(LogAction.getLogsSuccess, (state, action) => ({
        ...state,
        logs: [...action.logs],
        isBusy: false
    }))
);
