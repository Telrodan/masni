import { AppState } from 'src/app/reducer';

import { createSelector } from '@ngrx/store';

export const selectShoppingCartState = (state: AppState) => state.shoppingCart;

export const shoppingCartItemsSelector = createSelector(
  selectShoppingCartState,
  (state) => state.items
);
