import { Address } from './address.model';
import { Order } from './order.model';
import { ShoppingCartItem } from './shopping-cart-item.model';

export interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  passwordConfirm?: string;
  shoppingCart?: ShoppingCartItem[];
  orders?: Order[];
  shippingAddress: Address;
  billingAddress: Address;
  subscribed: boolean;
  active?: boolean;
  role?: string;
  passwordChangedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
