import { NavbarMenuItem } from '@core/models/navbar-menu-item.model';
import { Product } from '../product/product.model';
import { Material } from '../material/material.model';
import { Inspiration } from '../inspiration/inspiration.model';

export interface CategoryState {
    categories: Category[];
    navbarMenu: NavbarMenuItem[];
    isBusy: boolean;
}

export enum CategoryType {
    Product = 'Product',
    Material = 'Material',
    Inspiration = 'Inspiration'
}

export interface CategorySortItem {
    id: string;
    sortIndex: number;
}

export interface CategoryOrderData {
    isSubCategory: boolean;
    categories: CategorySortItem[];
}

export interface Category {
    id?: string;
    type: CategoryType;
    name: string;
    image?: string;
    description?: string;
    parentId?: string;
    sortOrder?: number;
    updatedAt?: Date;
    createdAt?: Date;
}

export interface ProductCategory extends Category {
    items: Product[];
}

export interface MaterialCategory extends Category {
    items: Material[];
}

export interface InspirationCategory extends Category {
    items: Inspiration[];
}
