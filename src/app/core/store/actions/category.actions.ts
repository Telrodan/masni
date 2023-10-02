import { createAction, props } from '@ngrx/store';

import { Category } from '@core/models/category.model';
import { Product } from '@core/models/product.model';
import { Material } from '@core/models/material.model';
import { Inspiration } from '@core/models/inspiration.model';

export enum CategoryActionsTypes {
  GET_CATEGORIES = '[Category] Get Categories',
  GET_CATEGORIES_SUCCESS = '[Category] Get Categories Success',
  GET_CATEGORIES_ERROR = '[Category] Get Categories Error',
  ADD_CATEGORY = '[Category] Add Category',
  UPDATE_CATEGORY = '[Category] Update Category',
  DELETE_CATEGORY = '[Category] Delete Category',
  ADD_ITEM_TO_CATEGORY = '[Category] Add Item To Category',
  DELETE_ITEM_FROM_CATEGORY = '[Category] Delete Item From Category',
  MOVE_ITEM_BETWEEN_CATEGORIES = '[Category] Move Item Between Categories'
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

export const updateCategory = createAction(
  CategoryActionsTypes.UPDATE_CATEGORY,
  props<{ category: Category }>()
);

export const deleteCategory = createAction(
  CategoryActionsTypes.DELETE_CATEGORY,
  props<{ id: string }>()
);

export const addItemToCategory = createAction(
  CategoryActionsTypes.ADD_ITEM_TO_CATEGORY,
  props<{ item: Product | Material | Inspiration }>()
);

export const deleteItemFromCategory = createAction(
  CategoryActionsTypes.DELETE_ITEM_FROM_CATEGORY,
  props<{ item: Product | Material | Inspiration }>()
);

export const moveItemBetweenCategories = createAction(
  CategoryActionsTypes.MOVE_ITEM_BETWEEN_CATEGORIES,
  props<{
    item: Product | Material | Inspiration;
  }>()
);
