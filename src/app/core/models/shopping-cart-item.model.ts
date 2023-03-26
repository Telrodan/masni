import { ProductExtra } from './product-extra.model';
import { Product } from './product.model';

export interface ShoppingCartItem {
  _id?: string;
  cartId?: string;
  product: string | Product;
  productExtra: ProductExtra;
  price: number;
}
