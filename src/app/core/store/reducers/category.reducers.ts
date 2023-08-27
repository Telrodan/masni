import { createReducer, on } from '@ngrx/store';

import {
  addCategory,
  addItemToCategory,
  deleteCategory,
  deleteProductFromCategory,
  getCategories,
  getCategoriesError,
  getCategoriesSuccess,
  moveItemBetweenCategories,
  updateCategory
} from '../actions';
import { CategoryState } from '../models/category-state.model';
import { StatusTypes } from '../status-types';

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

  on(addItemToCategory, (state, action) => {
    const categories = [...state.categories];
    const index = categories.findIndex(
      (category) => category.id === action.categoryId
    );

    if (index !== -1) {
      // Check if the category was found
      const updatedCategory = {
        ...categories[index], // Copy the category object
        items: [...categories[index].items, action.itemId] // Create a new items array
      };

      categories[index] = updatedCategory; // Update the category in the copy
    }

    return {
      ...state,
      categories
    };
  }),

  on(deleteProductFromCategory, (state, action) => {
    const categories = [...state.categories];

    const index = categories.findIndex(
      (category) => category.id === action.product.categoryId
    );

    const updatedProducts = [...categories[index].items];
    updatedProducts.splice(index, 1);

    const updatedCategories = [...categories];
    updatedCategories[index] = {
      ...categories[index],
      items: updatedProducts
    };

    return {
      ...state,
      categories: updatedCategories
    };
  }),

  on(moveItemBetweenCategories, (state, action) => {
    const categories = [...state.categories];

    const categoryIndex = categories.findIndex((category) =>
      category.items.includes(action.itemId)
    );

    if (categoryIndex !== -1) {
      // Check if categoryIndex is valid
      const itemIndex = categories[categoryIndex].items.findIndex(
        (item) => item === action.itemId
      );

      if (itemIndex !== -1) {
        // Check if itemIndex is valid
        const items = [...categories[categoryIndex].items];
        items.splice(itemIndex, 1);

        const updatedCategory = {
          ...categories[categoryIndex],
          items: items
        };

        categories[categoryIndex] = updatedCategory;
      }
    }

    const targetCategoryIndex = categories.findIndex(
      (category) => category.id === action.categoryId
    );

    if (targetCategoryIndex !== -1) {
      // Check if targetCategoryIndex is valid
      const updatedCategory = {
        ...categories[targetCategoryIndex],
        items: [...categories[targetCategoryIndex].items, action.itemId]
      };

      categories[targetCategoryIndex] = updatedCategory;
    }

    return {
      ...state,
      categories
    };
  })
);
