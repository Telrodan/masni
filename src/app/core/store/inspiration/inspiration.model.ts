import { InspirationCategory } from '@core/store/category/category.model';

export interface InspirationState {
    inspirations: Inspiration[];
    isBusy: boolean;
}

export interface Inspiration {
    id?: string;
    name: string;
    category: InspirationCategory;
    image: string;
    createdAt?: Date;
    updatedAt?: Date;
}
