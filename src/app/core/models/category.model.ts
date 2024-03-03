import { CategoryType } from '@core/enums/category-type.enum';
import { Product } from './product.model';
import { Material } from './material.model';
import { Inspiration } from './inspiration.model';

export interface Category {
  id?: string;
  type: CategoryType;
  isSubCategory?: boolean;
  subCategories?: ProductCategory[];
  mainCategory?: string;
  name: string;
  image: string;
  sortIndex?: number;
  description?: string;
  updatedAt?: Date;
  createdAt?: Date;
}

export interface ProductCategory extends Category {
  items: Product[];
  slug?: string;
}

export interface MaterialCategory extends Category {
  items: Material[];
}

export interface InspirationCategory extends Category {
  items: Inspiration[];
}
