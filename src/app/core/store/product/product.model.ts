import { Question } from '@core/models/question.model';
import { Review } from '@core/models/review.model';
import { InspirationCategory, ProductCategory } from '@core/store/category/category.model';

export interface BackendProduct {
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
    category: ProductCategory;
    inspirationCategory?: InspirationCategory;
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
    discountedPrice: number;
    discountPercentage: number;
    stock: number;
    likes: string[];
    canReview: boolean;
    reviews: Review[];
    updatedAt: Date;
    createdAt: Date;
}
