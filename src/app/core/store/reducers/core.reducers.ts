import { MaterialInterface } from '../../models/material.model';
import { Order } from '@core/models/order.model';
import { Coupon } from '../../models/coupon.mode';
import { SortedMaterials } from '../../models/sorted-materials.model';
import { ShoppingCartItem } from '@core/models/shopping-cart.model';

export const coreFeatureKey = 'core';

export interface CoreState {
  materials: MaterialInterface[];
  sortedMaterials: SortedMaterials;
  orders: Order[];
  coupons: Coupon[];
  shoppingCart: ShoppingCartItem[];
}

// export const coreReducer = createReducer(

// on(LoadMaterials, (state, action): CoreState => {
//   return {
//     ...state,
//     materials: action.materials
//   };
// }),
// on(setOrders, (state, action): CoreState => {
//   return {
//     ...state,
//     orders: action.orders
//   };
// }),
// on(setUserShoppingCart, (state, action): CoreState => {
//   return {
//     ...state,
//     shoppingCart: action.products
//   };
// }),
// on(deleteProductFromCart, (state, action): CoreState => {
//   const index = state.shoppingCart.findIndex(
//     (product) => product._id === action.product._id
//   );
//   const userProducts = [...state.shoppingCart];
//   userProducts.splice(index, 1);
//   return {
//     ...state,
//     shoppingCart: userProducts
//   };
// }),
// on(addProduct, (state, action): CoreState => {
//   return {
//     ...state,
//     shoppingCart: [...state.orders, action.product]
//   };
// }),
// on(setCoupons, (state, action): CoreState => {
//   return {
//     ...state,
//     coupons: action.coupons
//   };
// })
// );
