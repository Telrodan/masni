import { MaterialCategory } from './category.model';

export interface BackendMaterial {
    name: string;
    categoryId: string;
    image: string;
    extraPrice: number;
    isAvailable: boolean;
}
export interface Material {
    id: string;
    name: string;
    category: MaterialCategory;
    image: string;
    extraPrice: number;
    nameWithExtra: string;
    isAvailable: boolean;
    updatedAt: Date;
    createdAt: Date;
}
