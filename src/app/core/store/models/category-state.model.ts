import { Category } from '@core/models/category.model';
import { StatusTypes } from '../status-types';

export interface CategoryState {
  categories: Category[];
  status: StatusTypes;
}
