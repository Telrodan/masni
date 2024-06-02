import { MaterialCategory } from '@core/store/category/category.model';

export interface MaterialState {
    materials: Material[];
    isBusy: boolean;
}

export interface Material {
    id?: string;
    name: string;
    category: MaterialCategory;
    image: string;
    extraPrice: number;
    nameWithExtra?: string;
    isAvailable: boolean;
    updatedAt?: Date;
    createdAt?: Date;
}
