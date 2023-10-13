import { ShoppingCartItem } from './shopping-cart-item.model';

export interface ShoppingCartData {
  items: ShoppingCartItem[];
  price: number;
}
