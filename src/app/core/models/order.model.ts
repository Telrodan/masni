import { ShoppingCartItem } from './shopping-cart-item.model';
import { User } from './user.model';

export interface Order {
  id?: string;
  user: User;
  userEmail?: string;
  shipping: {
    method: string;
    address: string;
  };
  billing: string;
  products: ShoppingCartItem[];
  price: number;
  status: string;
  addedAt: Date;
}
