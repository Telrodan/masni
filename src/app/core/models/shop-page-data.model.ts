import { Product } from './product.model';

export interface ShopPageData {
  category: string;
  image: string;
  description?: string;
  products: Product[];
  priceFilter: string;
}
