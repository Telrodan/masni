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
      userEmail: order.user[0].email,
      user: { ...order.user[0], phone: formatPhoneNumber(order.user[0].phone) }
    }));

    return {
      ...state,
      orders: orders,
      status: StatusTypes.LOADED
    };
  }),

  on(getOrdersError, (state) => ({
    ...state,
    status: StatusTypes.ERROR
  }))
);
