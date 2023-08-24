import { CategoryType } from '@core/enums/category-type.enum';

export interface Category {
  id?: string;
  type: CategoryType;
  name: string;
  image: string;
  items: string[];
}
