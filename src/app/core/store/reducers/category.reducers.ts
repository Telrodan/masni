import { createReducer, on } from '@ngrx/store';
import {
  addCategory,
  deleteCategory,
  deleteProductFromCategory,
  getCategories,
  getCategoriesSuccess,
  updateCategory
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

  on(updateCategory, (state, action) => {
    const index = state.categories.findIndex(
      (category) => category.id === action.category.id
    );
    const categories = [...state.categories];
    categories.splice(index, 1, action.category);
    return {
      ...state,
      categories
    };
  }),

  on(deleteCategory, (state, action) => {
    const index = state.categories.findIndex((item) => item.id === action.id);
    const categories = [...state.categories];
    categories.splice(index, 1);
    return {
      ...state,
      categories
    };
  }),

  on(deleteProductFromCategory, (state, action) => {
    const categories = [...state.categories];
    categories.forEach((category) => {
      const index = category.products.findIndex(
        (product) => product === action.product.id
      );
      if (index !== -1) {
        category.products.splice(index, 1);
      }
    });
    return {
      ...state,
      categories
    };
  })
);
