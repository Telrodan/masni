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
