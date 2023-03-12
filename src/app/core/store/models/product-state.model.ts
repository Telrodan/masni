import { Product } from '@core/models/product.model';

export interface ProductState {
  products: Product[];
  availableProducts: Product[];
}
