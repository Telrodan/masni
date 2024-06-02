import { createAction, props } from '@ngrx/store';

import { NavbarMenuItem } from '@core/models/navbar-menu-item.model';
import { Category, CategoryOrderData } from './category.model';

const ACTION_PREFIX = '[Category]';

export const CategoryAction = {
    getCategories: createAction(`${ACTION_PREFIX} Get Categories`),

    getCategoriesSuccess: createAction(
        `${ACTION_PREFIX} Get Categories Success`,
        props<{ categories: Category[] }>()
    ),

    getNavbarMenu: createAction(`${ACTION_PREFIX} Get Navbar`),

    getNavbarMenuSuccess: createAction(
        `${ACTION_PREFIX} Get Navbar Success`,
        props<{ navbarMenu: NavbarMenuItem[] }>()
    ),

    addCategory: createAction(`${ACTION_PREFIX} Add Category`, props<{ category: Category }>()),

    addCategorySuccess: createAction(
        `${ACTION_PREFIX} Add Category Success`,
        props<{ category: Category }>()
    ),

    updateCategory: createAction(
        `${ACTION_PREFIX} Update Category`,
        props<{ category: Category }>()
    ),

    updateCategorySuccess: createAction(
        `${ACTION_PREFIX} Update Category Success`,
        props<{ category: Category }>()
    ),

    updateCategoriesOrder: createAction(
        `${ACTION_PREFIX} Update Categories Order`,
        props<{ categoryOrderData: CategoryOrderData }>()
    ),

    updateCategoriesOrderSuccess: createAction(
        `${ACTION_PREFIX} Update Categories Order Success`,
        props<{ categories: Category[] }>()
    ),

    deleteCategory: createAction(
        `${ACTION_PREFIX} Delete Category`,
        props<{ id: string; name: string }>()
    ),

    deleteCategorySuccess: createAction(
        `${ACTION_PREFIX} Delete Category Success`,
        props<{ id: string }>()
    ),

    deleteItemFromCategory: createAction(
        `${ACTION_PREFIX} Delete Item From Category Sync`,
        props<{ categoryId: string; itemId: string }>()
    ),

    addItemToCategory: createAction(
        `${ACTION_PREFIX} Add Item To Category Sync`,
        props<{ categoryId: string; itemId: string }>()
    )
};
