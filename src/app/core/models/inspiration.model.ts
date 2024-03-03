import { Category } from './category.model';

export interface RawInspiration {
  name: string;
  categoryId: string;
  image: string;
}

export interface Inspiration {
  id: string;
  name: string;
  category: Category;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}
