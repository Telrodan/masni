import { ShoppingCartItem } from '@core/models/shopping-cart.model';
import { createAction, props } from '@ngrx/store';
import { Coupon } from '../../models/coupon.mode';
import { Order } from '../../models/order.model';

export const setOrders = createAction(
  '[Core] Set Orders',
  props<{ orders: Order[] }>()
);

export const setUserShoppingCart = createAction(
  '[Core] Set User Shopping Cart',
  props<{ products: ShoppingCartItem[] }>()
);

export const addProduct = createAction(
  '[Core] Add Product To Cart',
  props<{ product: ShoppingCartItem }>()
);

export const deleteProductFromCart = createAction(
  '[Core] Delete Product From Cart',
  props<{ product: ShoppingCartItem }>()
);

export const deleteOrder = createAction(
  '[Core] Delete Order',
  props<{ order: Order }>()
);

export const setCoupons = createAction(
  '[Core] Set Coupons',
  props<{ coupons: Coupon[] }>()
);
