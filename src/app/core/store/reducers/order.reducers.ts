import { createReducer, on } from '@ngrx/store';
import { OrderState } from '../models/order-state.model';
import { getOrders, getOrdersSuccess } from '../actions/order.actions';

export const orderInitialState: OrderState = {
  orders: []
};

export const orderReducers = createReducer(
  orderInitialState,
  on(getOrders, (state) => ({
    ...state
  })),
  on(getOrdersSuccess, (state, action) => ({
    ...state,
    orders: action.orders
  }))
);
