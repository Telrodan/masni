import { CategoryType } from '@core/enums/category-type.enum';
import { Inspiration } from '@core/models/inspiration.model';
import { Material } from '@core/models/material.model';
import { NavbarMenuItem } from '@core/models/navbar-menu-item.model';
import { Product } from '../product/product.model';

export interface CategoryState {
    categories: Category[];
    navbarMenu: NavbarMenuItem[];
    isBusy: boolean;
}

export interface Category {
    id?: string;
    type: CategoryType;
    isSubCategory?: boolean;
    subCategories?: ProductCategory[];
    parentCategory?: string;
    name: string;
    image: string;
    sortIndex?: number;
    description?: string;
    updatedAt?: Date;
    createdAt?: Date;
}

export interface ProductCategory extends Category {
    items: Product[];
    slug?: string;
}

export interface MaterialCategory extends Category {
    items: Material[];
}

export interface InspirationCategory extends Category {
    items: Inspiration[];
}
