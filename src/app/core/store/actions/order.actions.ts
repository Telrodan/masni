import { Order } from '@core/models/order.model';
import { createAction, props } from '@ngrx/store';

export enum OrderActionTypes {
  GET_ORDERS = '[Order] Get Orders',
  GET_ORDERS_SUCCESS = '[Order] Get Orders Success'
}

export const getOrders = createAction(OrderActionTypes.GET_ORDERS);

export const getOrdersSuccess = createAction(
  OrderActionTypes.GET_ORDERS_SUCCESS,
  props<{ orders: Order[] }>()
);
