import { Order } from '@core/models/order.model';
import { StatusTypes } from '../status-types';

export interface OrderState {
  orders: Order[];
  status: StatusTypes;
}
