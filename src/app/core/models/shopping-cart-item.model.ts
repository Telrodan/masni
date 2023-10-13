import { Product } from './product.model';

export interface ShoppingCartItem {
  id?: string;
  userId?: string;
  product: Product;
  questions: any[];
  nameEmbroidery?: string;
  comment?: string;
  price: number;
}
