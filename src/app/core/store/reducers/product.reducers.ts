import { createReducer, on } from '@ngrx/store';
import {
  addProduct,
  deleteProduct,
  getProducts,
  getProductsSuccess,
  updateProduct
} from '../actions';

import { ProductState } from '../models/product-state.model';

export const productInitialState: ProductState = {
  products: []
};

export const productReducers = createReducer(
  productInitialState,

  on(getProducts, (state) => ({
    ...state
  })),

  on(getProductsSuccess, (state, action) => ({
    ...state,
    products: [...action.products]
  })),

  on(addProduct, (state, action) => {
    return {
      ...state,
      products: [...state.products, action.product]
    };
  }),
  on(deleteProduct, (state, action) => {
    const index = state.products.findIndex(
      (item) => item._id === action.product._id
    );
    const products = [...state.products];
    products.splice(index, 1);
    return {
      ...state,
      products
    };
  }),
  on(updateProduct, (state, action) => {
    const index = state.products.findIndex(
      (product) => product._id === action.product._id
    );
    const products = [...state.products];
    products.splice(index, 1, action.product);
    return {
      ...state,
      products
    };
  })
);
