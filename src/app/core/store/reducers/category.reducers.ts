import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';

import { Category } from '@core/models/category.model';
import { Material } from '@core/models/material.model';
import { Inspiration } from '@core/models/inspiration.model';
import { Product } from '@core/models/product.model';
import { CategoryState } from '../models/category-state.model';
import { StatusTypes } from '../status-types';
import {
  addCategory,
  addItemToCategory,
  deleteCategory,
  deleteItemFromCategory,
  getCategories,
  getCategoriesError,
  getCategoriesSuccess,
  moveItemBetweenCategories,
  updateCategory
} from '../actions';

export const categoryInitialState: CategoryState = {
  categories: [],
  status: StatusTypes.INIT
};

export const categoryReducers = createReducer(
  categoryInitialState,

  on(getCategories, (state) => ({
    ...state,
    status: StatusTypes.LOADING
  })),

  on(getCategoriesSuccess, (state, action) => {
    return {
      ...state,
      categories: [...action.categories],
      status: StatusTypes.LOADED
    };
  }),

  on(getCategoriesError, (state) => ({
    ...state,
    status: StatusTypes.ERROR
  })),

  on(addCategory, (state, action) => ({
    ...state,
    categories: [...state.categories, action.category]
  })),

  on(updateCategory, (state, action) => ({
    ...state,
    categories: state.categories.map((category) =>
      category.id === action.category.id ? action.category : category
    )
  })),

  on(deleteCategory, (state, action) => ({
    ...state,
    categories: state.categories.filter((category) => category.id !== action.id)
  })),

  on(addItemToCategory, (state, action) => {
    // TODO: refactor this when category can be only Category
    const categories = _.cloneDeep(state.categories);

    const index = categories.findIndex(
      (category) => category.id === (action.item.category as Category).id
    );

    // categories[index].items.push(action.item);

    return {
      ...state,
      categories
    };
  }),

  on(deleteItemFromCategory, (state, action) => {
    // TODO: refactor this when category can be only Category
    const categories = _.cloneDeep(state.categories);

    const index = categories.findIndex(
      (category) => category.id === (action.item.category as Category).id
    );

    // categories[index].items = categories[index].items.filter(
    //   (item) => (item as Product | Material | Inspiration).id !== action.item.id
    // );

    return {
      ...state,
      categories
    };
  }),

  on(moveItemBetweenCategories, (state, action) => {
    // TODO: refactor this when category can be only Category
    const categories = _.cloneDeep(state.categories);

    // categories.forEach((category) => {
    //   const index = category.items.findIndex(
    //     (item) => item.id === action.item.id
    //   );

    //   if (index > -1) {
    //     category.items.splice(index, 1);
    //   }

    //   if (category.id === (action.item.category as Category).id) {
    //     category.items.push(action.item);
    //   }
    // });

    return { ...state, categories };
  })
);
