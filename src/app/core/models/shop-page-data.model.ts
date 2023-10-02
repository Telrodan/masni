import { Product } from './product.model';

export interface ShopPageData {
  category: string;
  image: string;
  products: Product[];
  priceFilter: string;
}
