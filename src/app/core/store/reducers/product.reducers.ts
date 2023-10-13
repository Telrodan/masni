import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';

import {
  addMaterialQuestionOptionToProduct,
  addProduct,
  deleteProduct,
  deleteProductQuestionMaterialOption,
  getProducts,
  getProductsError,
  getProductsSuccess,
  removeQuestionFromProduct,
  updateProduct,
  updateProductsCategory,
  updateProductsQuestion
} from '../actions';

import { ProductState } from '../models/product-state.model';
import { StatusTypes } from '../status-types';

export const productInitialState: ProductState = {
  products: [],
  status: StatusTypes.INIT
};

export const productReducers = createReducer(
  productInitialState,

  on(getProducts, (state) => ({
    ...state,
    status: StatusTypes.LOADING
  })),

  on(getProductsSuccess, (state, action) => ({
    ...state,
    products: [...action.products],
    status: StatusTypes.LOADED
  })),

  on(getProductsError, (state) => ({
    ...state,
    status: StatusTypes.ERROR
  })),

  on(addProduct, (state, action) => ({
    ...state,
    products: [...state.products, action.product]
  })),

  on(deleteProduct, (state, action) => ({
    ...state,
    products: state.products.filter(
      (product) => product.id !== action.product.id
    )
  })),

  on(updateProduct, (state, action) => {
    return {
      ...state,
      products: state.products.map((product) =>
        product.id === action.product.id ? action.product : product
      )
    };
  }),

  on(removeQuestionFromProduct, (state, action) => {
    const products = _.cloneDeep(state.products);

    products.forEach((product) => {
      product.questions = product.questions.filter(
        (question) => question.id !== action.id
      );
    });

    return {
      ...state,
      products
    };
  }),

  on(updateProductsQuestion, (state, action) => {
    const products = _.cloneDeep(state.products);

    products.forEach((product) => {
      product.questions.forEach((question) => {
        if (question.id === action.question.id) {
          const index = product.questions.findIndex(
            (item) => item.id === action.question.id
          );
          product.questions[index] = action.question;
        }
      });
    });

    return {
      ...state,
      products
    };
  }),

  on(updateProductsCategory, (state, action) => {
    const products = _.cloneDeep(state.products);

    products.forEach((product) => {
      if (product.category.id === action.category.id) {
        product.category = action.category;
      }
    });

    return {
      ...state,
      products
    };
  }),

  on(deleteProductQuestionMaterialOption, (state, action) => {
    const products = _.cloneDeep(state.products);

    products.forEach((product) => {
      product.questions.forEach((question) => {
        question.options.forEach((option) => {
          if (option.materialId === action.material.id) {
            const index = question.options.findIndex(
              (item) => item.materialId === action.material.id
            );
            question.options.splice(index, 1);
          }
        });
      });
    });

    return {
      ...state,
      products
    };
  }),

  on(addMaterialQuestionOptionToProduct, (state, action) => {
    const products = _.cloneDeep(state.products);
    products.forEach((product) => {
      product.questions.forEach((question) => {
        const optionMaterialIds = question.options.map(
          (option) => option.materialId
        );
        const optionMaterialCategoryIds = question.materialCategories.map(
          (category) => category.id
        );

        if (
          !optionMaterialIds.includes(action.material.id) &&
          optionMaterialCategoryIds.includes(action.material.category.id)
        ) {
          question.options.push({
            materialId: action.material.id,
            name: action.material.name,
            extraPrice: action.material.extraPrice,
            slug: action.material.extraPrice
              ? action.material.name + ' +' + action.material.extraPrice + ' Ft'
              : action.material.name
          });
        }
      });
    });

    return {
      ...state,
      products
    };
  })
);
