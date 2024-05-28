import { createAction, props } from '@ngrx/store';

import { Category } from '@core/models/category.model';
import { CategoryOrderData } from '@features/admin/components/categories/order-categories/order-categories.component';
import { NavbarMenuItem } from '@core/models/navbar-menu-item.model';

// export enum CategoryActionsTypes {
//     GET_CATEGORIES = '[Category] Get Categories',
//     GET_CATEGORIES_SUCCESS = '[Category] Get Categories Success',
//     ADD_CATEGORY = '[Category] Add Category',
//     UPDATE_CATEGORY = '[Category] Update Category',
//     DELETE_CATEGORY = '[Category] Delete Category',
//     ADD_ITEM_TO_CATEGORY = '[Category] Add Item To Category',
//     DELETE_ITEM_FROM_CATEGORY = '[Category] Delete Item From Category',
//     MOVE_ITEM_BETWEEN_CATEGORIES = '[Category] Move Item Between Categories'
// }

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
    )
};
