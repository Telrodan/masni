import { createReducer, on } from '@ngrx/store';
import { getProducts, getProductsSuccess } from '../actions';

import { ProductState } from '../models/product-state.model';

export const initialState: ProductState = {
  products: [],
  availableProducts: []
};

export const productReducers = createReducer(
  initialState,

  on(getProducts, (state) => ({
    ...state
  })),

  on(getProductsSuccess, (state, action) => {
    const availableProducts = action.products.filter(
      (product) => product.productStatus === 'available'
    );
    return {
      ...state,
      products: action.products,
      availableProducts
    };
  })
);
