import { createReducer, on } from '@ngrx/store';

import { ShoppingCartState } from '@core/store/models/shopping-cart-state.model';
import {
  addShoppingCartItem,
  deleteShoppingCartItem,
  getShoppingCartItems,
  getShoppingCartItemsSuccess
} from '../actions/shopping-cart.actions';

export const shoppingCartInitialState: ShoppingCartState = {
  items: []
};

export const shoppingCartReducers = createReducer(
  shoppingCartInitialState,

  on(getShoppingCartItems, (state) => ({
    ...state
  })),

  on(getShoppingCartItemsSuccess, (state, action) => ({
    ...state,
    items: action.items
  })),

  on(addShoppingCartItem, (state, action) => ({
    ...state,
    items: [...state.items, action.item]
  })),

  on(deleteShoppingCartItem, (state, action) => {
    const index = state.items.findIndex((item) => item._id === action.item._id);
    const items = [...state.items];
    items.splice(index, 1);
    return {
      ...state,
      items
    };
  })
);
