import { Question } from './question.model';

export interface Product {
  id?: string;
  categoryId: string;
  name: string;
  shortDescription: string;
  description: string;
  questions: string[] | Question[];
  isCustom: boolean;
  isNameEmbroideryAvailable: boolean;
  images: string[];
  category?: string;
  price: number;
  discountedPrice?: number;
  discountPercentage?: number;
  stock: number;
  updatedAt?: Date;
  createdAt?: Date;
}
