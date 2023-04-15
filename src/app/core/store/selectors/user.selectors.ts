import { AppState } from 'src/app/reducer';

import { createSelector } from '@ngrx/store';

export const selectUserState = (state: AppState) => state.user;

export const userSelector = createSelector(
  selectUserState,
  (state) => state.user
);

export const selectUsers = createSelector(
  selectUserState,
  (state) => state.users
);
