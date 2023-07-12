import { createSelector } from '@ngrx/store';
import { AppState } from '@core/store/app-state';

export const selectOrderState = (state: AppState) => state.order;

export const selectAllOrders = createSelector(
  selectOrderState,
  (state) => state.orders
);
