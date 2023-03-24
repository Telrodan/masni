import { createReducer, on } from '@ngrx/store';
import { getCategories, getCategoriesSuccess } from '../actions';
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
  })
);
