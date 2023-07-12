import { AppState } from '@core/store/app-state';

import { createSelector } from '@ngrx/store';

export const selectInspirationState = (state: AppState) => state.inspiration;

export const selectAllInspiration = createSelector(
  selectInspirationState,
  (state) => state.inspirations
);
