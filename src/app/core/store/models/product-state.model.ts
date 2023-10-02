import { Product } from '@core/models/product.model';
import { StatusTypes } from '../status-types';

export interface ProductState {
  products: Product[];
  status: StatusTypes;
}
