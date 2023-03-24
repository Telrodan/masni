import { Product } from './product.model';

export interface Category {
  _id: string;
  categoryName: string;
  products: Product[];
}
