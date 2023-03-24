import { createReducer, on } from '@ngrx/store';
import { getProducts, getProductsSuccess } from '../actions';

import { ProductState } from '../models/product-state.model';

export const productInitialState: ProductState = {
  products: []
};

export const productReducers = createReducer(
  productInitialState,

  on(getProducts, (state) => ({
    ...state
  })),

  on(getProductsSuccess, (state, action) => {
    return {
      ...state,
      products: [...action.products]
    };
  })
);
