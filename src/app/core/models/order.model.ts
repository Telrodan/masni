import { ShoppingCartItem } from './shopping-cart-item.model';
import { User } from './user.model';

export interface Order {
  id?: string;
  user: User;
  shipping: {
    method: string;
    address: string;
  };
  billing: string;
  items: ShoppingCartItem[];
  price: number;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}
