import { Category } from './category.model';
import { Question } from './question.model';

export interface RawProduct {
  categoryId: string;
  inspirationCategoryId?: string;
  name: string;
  shortDescription: string;
  description: string;
  questions: string[];
  isCustom: boolean;
  isDollDress: boolean;
  isDressable: boolean;
  isFeatured: boolean;
  isNameEmbroideryAvailable: boolean;
  images: string[];
  price: number;
  discountedPrice: number;
  stock: number;
}

export interface Product {
  id: string;
  category: Category;
  inspirationCategory?: Category;
  name: string;
  shortDescription: string;
  description: string;
  questions: Question[];
  isCustom: boolean;
  isDollDress: boolean;
  isDressable: boolean;
  isFeatured: boolean;
  isNameEmbroideryAvailable: boolean;
  images: string[];
  price: number;
  discountedPrice?: number;
  discountPercentage?: number;
  stock: number;
  likes: string[];
  updatedAt: Date;
  createdAt: Date;
}
