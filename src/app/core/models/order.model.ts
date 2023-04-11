import { ShoppingCartItem } from './shopping-cart-item.model';
import { User } from './user.model';

export interface Order {
  _id?: string;
  user: User;
  shipping: {
    method: string;
    address: string;
  };
  products: ShoppingCartItem[];
  price: number;
  status: string;
  addedAt: Date;
}
