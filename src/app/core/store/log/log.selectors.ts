import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state.model';

const selectLogState = (state: AppState) => state.log;

export const LogSelector = {
    selectLogs: () => createSelector(selectLogState, (logState) => logState.logs),

    selectLogsByItemId: (id: string) =>
        createSelector(selectLogState, (logState) =>
            logState.logs.filter((log) => log.meta.itemId === id)
        )
};
