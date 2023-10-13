import { createReducer, on } from '@ngrx/store';
import { OrderState } from '../models/order-state.model';
import {
  getOrders,
  getOrdersError,
  getOrdersSuccess
} from '../actions/order.actions';
import { StatusTypes } from '../status-types';
import { formatPhoneNumber } from 'src/app/shared/util/format-phone-number';

export const orderInitialState: OrderState = {
  orders: [],
  status: StatusTypes.INIT
};

export const orderReducers = createReducer(
  orderInitialState,
  on(getOrders, (state) => ({
    ...state,
    status: StatusTypes.LOADING
  })),

  on(getOrdersSuccess, (state, action) => {
    const orders = action.orders.map((order) => ({
      ...order,
      user: { ...order.user, phone: formatPhoneNumber(order.user.phone) }
    }));

    return {
      ...state,
      orders,
      status: StatusTypes.LOADED
    };
  }),

  on(getOrdersError, (state) => ({
    ...state,
    status: StatusTypes.ERROR
  }))
);
