import { InspirationCategory } from '@core/store/category/category.model';

export interface BackendInspiration {
    name: string;
    categoryId: string;
    image: string;
}

export interface Inspiration {
    id: string;
    name: string;
    category: InspirationCategory;
    image: string;
    createdAt?: Date;
    updatedAt?: Date;
}
