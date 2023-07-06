import { Product } from '@core/models/product.model';

export interface ProductState {
  allProducts: Product[];
  availableProducts: Product[];
}
