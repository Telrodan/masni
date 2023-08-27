import { createAction, props } from '@ngrx/store';

import { Category } from '@core/models/category.model';
import { Product } from '@core/models/product.model';

export enum CategoryActionsTypes {
  GET_CATEGORIES = '[Category] Get Categories',
  GET_CATEGORIES_SUCCESS = '[Category] Get Categories Success',
  GET_CATEGORIES_ERROR = '[Category] Get Categories Error',
  ADD_CATEGORY = '[Category] Add Category',
  UPDATE_CATEGORY = '[Category] Update Category',
  DELETE_CATEGORY = '[Category] Delete Category',
  ADD_PRODUCT_TO_CATEGORY = '[Category] Add Product To Category',
  DELETE_PRODUCT_FROM_CATEGORY = '[Category] Delete Product From Category',
  MOVE_PRODUCT_TO_CATEGORY = '[Category] Move Product To Category'
}

export const getCategories = createAction(CategoryActionsTypes.GET_CATEGORIES);

export const getCategoriesSuccess = createAction(
  CategoryActionsTypes.GET_CATEGORIES_SUCCESS,
  props<{ categories: Category[] }>()
);

export const getCategoriesError = createAction(
  CategoryActionsTypes.GET_CATEGORIES_ERROR
);

export const addCategory = createAction(
  CategoryActionsTypes.ADD_CATEGORY,
  props<{ category: Category }>()
);

export const deleteCategory = createAction(
  CategoryActionsTypes.DELETE_CATEGORY,
  props<{ id: string }>()
);

export const updateCategory = createAction(
  CategoryActionsTypes.UPDATE_CATEGORY,
  props<{ category: Category }>()
);

export const addItemToCategory = createAction(
  CategoryActionsTypes.ADD_PRODUCT_TO_CATEGORY,
  props<{ itemId: string; categoryId: string }>()
);

export const deleteProductFromCategory = createAction(
  CategoryActionsTypes.DELETE_PRODUCT_FROM_CATEGORY,
  props<{ product: Product }>()
);

export const moveItemBetweenCategories = createAction(
  CategoryActionsTypes.MOVE_PRODUCT_TO_CATEGORY,
  props<{ itemId: string; categoryId: string }>()
);
