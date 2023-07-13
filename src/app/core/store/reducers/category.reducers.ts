import { createReducer, on } from '@ngrx/store';

import {
  addCategory,
  addProductToCategory,
  deleteCategory,
  deleteProductFromCategory,
  getCategories,
  getCategoriesError,
  getCategoriesSuccess,
  moveProductToCategory,
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

  on(addProductToCategory, (state, action) => {
    const categories = [...state.categories];

    const index = categories.findIndex(
      (category) => category.id === action.product.categoryId
    );

    const updatedProducts = [...categories[index].products];

    updatedProducts.push(action.product.id);

    const updatedCategories = [...categories];
    updatedCategories[index] = {
      ...categories[index],
      products: updatedProducts
    };

    return {
      ...state,
      categories: updatedCategories
    };
  }),

  on(deleteProductFromCategory, (state, action) => {
    const categories = [...state.categories];

    const index = categories.findIndex(
      (category) => category.id === action.product.categoryId
    );

    const updatedProducts = [...categories[index].products];
    updatedProducts.splice(index, 1);

    const updatedCategories = [...categories];
    updatedCategories[index] = {
      ...categories[index],
      products: updatedProducts
    };

    return {
      ...state,
      categories: updatedCategories
    };
  }),

  /**
   * Reducer function that handles the action of moving a product to a different category.
   *
   * @param {Object} state - The current state object.
   * @param {Object} action - The action object containing information about the product and the target category.
   */
  on(moveProductToCategory, (state, action) => {
    const categories = [...state.categories];

    // Find the original category that contains the product
    const originalCategory = categories.find((category) =>
      category.products.includes(action.product.id)
    );

    // Check if the product needs to be moved to a different category

    if (originalCategory.id !== action.product.categoryId) {
      // Find the index of the original category in the categories array
      const originalCategoryIndex = categories.findIndex(
        (category) => category.id === originalCategory.id
      );

      // Create a new array of products for the original category, excluding the moved product
      const updatedOriginalCategoryProducts = [...originalCategory.products];
      updatedOriginalCategoryProducts.splice(
        updatedOriginalCategoryProducts.indexOf(action.product.id),
        1
      );

      // Update the original category with the updated products array
      categories[originalCategoryIndex] = {
        ...categories[originalCategoryIndex],
        products: updatedOriginalCategoryProducts
      };

      // Find the index of the target category in the categories array
      const updatedCategoryIndex = categories.findIndex(
        (category) => category.id === action.product.categoryId
      );

      // Create a new array of products for the target category, including the moved product
      const updatedCategoryProducts = [
        ...categories[updatedCategoryIndex].products
      ];
      updatedCategoryProducts.push(action.product.id);

      // Update the target category with the updated products array
      categories[updatedCategoryIndex] = {
        ...categories[updatedCategoryIndex],
        products: updatedCategoryProducts
      };

      // Return the updated state object with the modified categories array
      return {
        ...state,
        categories
      };
    } else {
      // If the product is already in the target category, return the original state object
      return {
        ...state
      };
    }
  })
);
