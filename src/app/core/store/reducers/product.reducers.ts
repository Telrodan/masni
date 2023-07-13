import { createReducer, on } from '@ngrx/store';
import {
  addProduct,
  deleteProduct,
  getProducts,
  getProductsError,
  getProductsSuccess,
  updateProduct
} from '../actions';

import { ProductState } from '../models/product-state.model';
import { StatusTypes } from '../status-types';

export const productInitialState: ProductState = {
  allProducts: [],
  availableProducts: [],
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
    allProducts: action.products,
    availableProducts: action.products.filter((product) => product.stock > 0),
    status: StatusTypes.LOADED
  })),

  on(getProductsError, (state) => ({
    ...state,
    status: StatusTypes.ERROR
  })),

  on(addProduct, (state, action) => {
    const availableProducts = [...state.availableProducts];
    if (action.product.stock > 0) {
      availableProducts.push(action.product);
    }
    return {
      ...state,
      allProducts: [...state.allProducts, action.product],
      availableProducts
    };
  }),

  on(deleteProduct, (state, action) => {
    const index = state.allProducts.findIndex(
      (item) => item.id === action.product.id
    );
    const products = [...state.allProducts];
    products.splice(index, 1);

    return {
      ...state,
      allProducts: products
    };
  }),

  on(updateProduct, (state, action) => {
    const availableProducts = [...state.availableProducts];
    if (action.product.stock > 0) {
      if (!availableProducts.includes(action.product)) {
        availableProducts.push(action.product);
      } else {
        const index = availableProducts.findIndex(
          (product) => product.id === action.product.id
        );
        availableProducts.splice(index, 1, action.product);
      }
    } else {
      const index = availableProducts.findIndex(
        (product) => product.id === action.product.id
      );
      availableProducts.splice(index, 1);
    }

    const index = state.allProducts.findIndex(
      (product) => product.id === action.product.id
    );
    const allProducts = [...state.allProducts];
    allProducts.splice(index, 1, action.product);

    return {
      ...state,
      allProducts,
      availableProducts
    };
  })
);
