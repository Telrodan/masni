import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/reducer';

export const selectOrderState = (state: AppState) => state.order;

export const selectOrders = createSelector(
  selectOrderState,
  (state) => state.orders
);
