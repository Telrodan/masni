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
  allProducts: [],
  availableProducts: []
};

export const productReducers = createReducer(
  productInitialState,

  on(getProducts, (state) => ({
    ...state
  })),

  on(getProductsSuccess, (state, action) => ({
    ...state,
    allProducts: action.products,
    availableProducts: action.products.filter((product) => product.stock > 0)
  })),

  on(addProduct, (state, action) => ({
    ...state,
    allProducts: [...state.allProducts, action.product]
  })),

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
    const index = state.allProducts.findIndex(
      (product) => product.id === action.product.id
    );
    const products = [...state.allProducts];
    products.splice(index, 1, action.product);

    return {
      ...state,
      products
    };
  })
);
