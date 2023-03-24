import { createReducer, on } from '@ngrx/store';
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategoriesSuccess
} from '../actions';
import { CategoryState } from '../models/category-state.model';

export const categoryInitialState: CategoryState = {
  categories: []
};

export const categoryReducers = createReducer(
  categoryInitialState,
  on(getCategories, (state) => ({
    ...state
  })),
  on(getCategoriesSuccess, (state, action) => {
    return {
      ...state,
      categories: [...action.categories]
    };
  }),
  on(addCategory, (state, action) => ({
    ...state,
    categories: [...state.categories, action.category]
  })),

  on(deleteCategory, (state, action) => {
    const index = state.categories.findIndex((item) => item._id === action.id);
    const categories = [...state.categories];
    categories.splice(index, 1);
    return {
      ...state,
      categories
    };
  })
);
