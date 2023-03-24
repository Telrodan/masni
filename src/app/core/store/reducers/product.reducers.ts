import { createReducer, on } from '@ngrx/store';
import { addProduct, getProducts, getProductsSuccess } from '../actions';

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

  on(addProduct, (state, action) => ({
    ...state,
    products: [...state.products, action.product]
  }))
);
