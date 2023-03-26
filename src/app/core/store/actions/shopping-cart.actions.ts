import { ShoppingCartItem } from '@core/models/shopping-cart-item.model';
import { createAction, props } from '@ngrx/store';

export enum ShoppingCartActionTypes {
  GET_ITEMS = '[Shopping Cart] Get Items',
  GET_ITEMS_SUCCESS = '[Shopping Cart] Get Items Success',
  ADD_ITEM = '[Shopping Cart] Add Item',
  DELETE_ITEM = '[Shopping Cart] Delete Item'
}

export const getShoppingCartItems = createAction(
  ShoppingCartActionTypes.GET_ITEMS
);

export const getShoppingCartItemsSuccess = createAction(
  ShoppingCartActionTypes.GET_ITEMS_SUCCESS,
  props<{ shoppingCartItems: ShoppingCartItem[] }>()
);

export const addShoppingCartItem = createAction(
  ShoppingCartActionTypes.ADD_ITEM,
  props<{ shoppingCartItem: ShoppingCartItem }>()
);

export const deleteShoppingCartItem = createAction(
  ShoppingCartActionTypes.DELETE_ITEM,
  props<{ shoppingCartItem: ShoppingCartItem }>()
);
