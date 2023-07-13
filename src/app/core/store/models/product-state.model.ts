import { Product } from '@core/models/product.model';
import { StatusTypes } from '../status-types';

export interface ProductState {
  allProducts: Product[];
  availableProducts: Product[];
  status: StatusTypes;
}
