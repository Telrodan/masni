import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state.model';
import { Inspiration } from './inspiration.model';

const selectInspirationState = (state: AppState) => state.inspiration;

export const InspirationSelector = {
    selectInspirations: () =>
        createSelector(selectInspirationState, (inspirationState) => inspirationState.inspirations),

    selectInspirationById: (inspirationId: string) =>
        createSelector(
            selectInspirationState,
            (inspirationState): Inspiration =>
                inspirationState.inspirations.find(
                    (inspiration) => inspiration.id === inspirationId
                )
        ),

    isBusy: () =>
        createSelector(
            selectInspirationState,
            (inspirationState): boolean => inspirationState.isBusy
        )
};
