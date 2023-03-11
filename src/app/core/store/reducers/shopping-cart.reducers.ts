import { createReducer, on } from '@ngrx/store';

import { ShoppingCartState } from '@core/store/models/shopping-cart-state.model';
import {
  getShoppingCartItems,
  getShoppingCartItemsSuccess
} from '../actions/shopping-cart.actions';

export const initialState: ShoppingCartState = {
  shoppingCartItems: []
};

export const shoppingCartReducers = createReducer(
  initialState,
  on(getShoppingCartItems, (state) => ({
    ...state
  })),
  on(getShoppingCartItemsSuccess, (state, action) => ({
    ...state,
    shoppingCartItems: action.shoppingCartItems
  }))
);
