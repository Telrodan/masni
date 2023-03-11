import { ShoppingCartItem } from '@core/models/shopping-cart.model';
import { createAction, props } from '@ngrx/store';

export enum ShoppingCartActionTypes {
  GET_ITEMS = '[Shopping Cart] Get Items',
  GET_ITEMS_SUCCESS = '[Shopping Cart] Get Items Success'
}

export const getShoppingCartItems = createAction(
  ShoppingCartActionTypes.GET_ITEMS
);

export const getShoppingCartItemsSuccess = createAction(
  ShoppingCartActionTypes.GET_ITEMS_SUCCESS,
  props<{ shoppingCartItems: ShoppingCartItem[] }>()
);
