import { createAction, props } from '@ngrx/store';

import { Category } from '@core/models/category.model';

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

    deleteCategory: createAction(
        `${ACTION_PREFIX} Delete Category`,
        props<{ categoryId: string }>()
    ),

    deleteCategorySuccess: createAction(
        `${ACTION_PREFIX} Delete Category Success`,
        props<{ categoryId: string }>()
    )
};
