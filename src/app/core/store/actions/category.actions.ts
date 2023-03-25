import { Category } from '@core/models/category.model';
import { createAction, props } from '@ngrx/store';

export enum CategoryActionsTypes {
  GET_CATEGORIES = '[Category] Get Categories',
  GET_CATEGORIES_SUCCESS = '[Category] Get Categories Success',
  ADD_CATEGORY = '[Category] Add Category',
  UPDATE_CATEGORY = '[Category] Update Category',
  DELETE_CATEGORY = '[Category] Delete Category'
}

export const getCategories = createAction(CategoryActionsTypes.GET_CATEGORIES);

export const getCategoriesSuccess = createAction(
  CategoryActionsTypes.GET_CATEGORIES_SUCCESS,
  props<{ categories: Category[] }>()
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
