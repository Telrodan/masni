import { AppState } from '@core/store/app-state';

import { createSelector } from '@ngrx/store';

export const selectUserState = (state: AppState) => state.user;

export const userSelector = createSelector(
  selectUserState,
  (state) => state.user
);

export const selectUserShoppingCart = createSelector(
  selectUserState,
  (state) => state.user.shoppingCart
);

export const selectUsers = createSelector(
  selectUserState,
  (state) => state.users
);
