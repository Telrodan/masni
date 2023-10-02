import { CategoryType } from '@core/enums/category-type.enum';
import { Product } from './product.model';
import { Material } from './material.model';
import { Inspiration } from './inspiration.model';

export interface RawCategory {
  type: CategoryType;
  name: string;
  image: string;
}

export interface Category {
  id: string;
  type: CategoryType;
  name: string;
  image: string;
  items: (Product | Material | Inspiration)[];
  updatedAt: Date;
  createdAt: Date;
}
