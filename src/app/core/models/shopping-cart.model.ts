import { ShoppingCartItem } from './shopping-cart-item.model';

export interface ShoppingCart {
  _id: string;
  items: ShoppingCartItem[];
}
