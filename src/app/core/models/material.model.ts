import { Category } from './category.model';

export interface RawMaterial {
  name: string;
  categoryId: string;
  image: string;
  extraPrice: number;
  isAvailable: boolean;
}
export interface Material {
  id: string;
  name: string;
  category: Category;
  image: string;
  extraPrice: number;
  nameWithExtra: string;
  isAvailable: boolean;
  updatedAt: Date;
  createdAt: Date;
}
