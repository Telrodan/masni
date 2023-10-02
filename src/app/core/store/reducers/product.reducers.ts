import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';

import {
  addProduct,
  deleteProduct,
  getProducts,
  getProductsError,
  getProductsSuccess,
  removeQuestionFromProduct,
  updateProduct,
  updateProductsCategory
} from '../actions';

import { ProductState } from '../models/product-state.model';
import { StatusTypes } from '../status-types';
import { Category } from '@core/models/category.model';

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

  // on(removeQuestionFromProduct, (state, action) => {
  //   const products = _.cloneDeep(state.products);

  //   products.forEach((product) => {
  //     if (product.questions.includes(action.id)) {
  //       const index = product.questions.findIndex(
  //         (questionId) => questionId === action.id
  //       );
  //       product.questions.splice(index, 1);
  //     }
  //   });

  //   return {
  //     ...state,
  //     products
  //   };
  // }),

  on(updateProductsCategory, (state, action) => {
    const products = _.cloneDeep(state.products);

    products.forEach((product) => {
      if ((product.category as Category).id === action.category.id) {
        product.category = action.category;
      }
    });

    return {
      ...state,
      products
    };
  })
);
