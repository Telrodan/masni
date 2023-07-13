import { ShoppingCartItem } from '@core/models/shopping-cart-item.model';
import { StatusTypes } from '../status-types';

export interface ShoppingCartState {
  items: ShoppingCartItem[];
  status: StatusTypes;
}
