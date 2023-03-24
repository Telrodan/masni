import { Category } from '@core/models/category.model';
import { createAction, props } from '@ngrx/store';

export enum CategoryActionsTypes {
  GET_CATEGORIES = '[Category] Get Categories',
  GET_CATEGORIES_SUCCESS = '[Category] Get Categories Success'
}

export const getCategories = createAction(CategoryActionsTypes.GET_CATEGORIES);

export const getCategoriesSuccess = createAction(
  CategoryActionsTypes.GET_CATEGORIES_SUCCESS,
  props<{ categories: Category[] }>()
);
