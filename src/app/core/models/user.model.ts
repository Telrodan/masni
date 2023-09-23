import { Address } from './address.model';
import { ShoppingCart } from './shopping-cart.model';

export interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  passwordConfirm?: string;
  shoppingCart?: ShoppingCart;
  shippingAddress: Address;
  billingAddress: Address;
  subscribed: boolean;
  active?: boolean;
  passwordChangedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
