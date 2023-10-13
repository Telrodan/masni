import { createReducer, on } from '@ngrx/store';

import { ShoppingCartState } from '@core/store/models/shopping-cart-state.model';
import {
  addShoppingCartItem,
  deleteShoppingCartItem,
  getShoppingCartItems,
  getShoppingCartItemsError,
  getShoppingCartItemsSuccess
} from '../actions/shopping-cart.actions';
import { StatusTypes } from '../status-types';

export const shoppingCartInitialState: ShoppingCartState = {
  items: [],
  status: StatusTypes.INIT
};

export const shoppingCartReducers = createReducer(
  shoppingCartInitialState,

  on(getShoppingCartItems, (state) => ({
    ...state,
    status: StatusTypes.LOADING
  })),

  on(getShoppingCartItemsSuccess, (state, action) => ({
    ...state,
    items: action.items,
    status: StatusTypes.LOADED
  })),

  on(getShoppingCartItemsError, (state) => ({
    ...state,
    status: StatusTypes.ERROR
  })),

  on(addShoppingCartItem, (state, action) => ({
    ...state,
    items: [...state.items, action.item]
  })),

  on(deleteShoppingCartItem, (state, action) => {
    const index = state.items.findIndex((item) => item.id === action.item.id);
    const items = [...state.items];
    items.splice(index, 1);
    return {
      ...state,
      items
    };
  })
);
