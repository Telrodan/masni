import { createReducer, on } from '@ngrx/store';

import { ShoppingCartState } from '@core/store/models/shopping-cart-state.model';
import {
  addShoppingCartItem,
  deleteShoppingCartItem,
  getShoppingCartItems,
  getShoppingCartItemsSuccess
} from '../actions/shopping-cart.actions';

export const shoppingCartInitialState: ShoppingCartState = {
  shoppingCartItems: []
};

export const shoppingCartReducers = createReducer(
  shoppingCartInitialState,

  on(getShoppingCartItems, (state) => ({
    ...state
  })),

  on(getShoppingCartItemsSuccess, (state, action) => ({
    ...state,
    shoppingCartItems: action.shoppingCartItems
  })),

  on(addShoppingCartItem, (state, action) => ({
    ...state,
    shoppingCartItems: [...state.shoppingCartItems, action.shoppingCartItem]
  })),

  on(deleteShoppingCartItem, (state, action) => {
    const index = state.shoppingCartItems.findIndex(
      (item) => item._id === action.shoppingCartItem._id
    );
    const shoppingCartItems = [...state.shoppingCartItems];
    shoppingCartItems.splice(index, 1);
    return {
      ...state,
      shoppingCartItems: shoppingCartItems
    };
  })
);
