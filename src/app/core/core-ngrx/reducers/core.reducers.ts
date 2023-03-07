import { createReducer, on } from '@ngrx/store';

import { Material } from '../../models/material.model';
import { Order } from '../../models/order.model';
import { Coupon } from '../../models/coupon.mode';
import { initialCoreState } from '../initial-state/core.initial-state';
import coreActions from '../actions';
import { SortedMaterials } from '../../models/sorted-materials.model';
import coreSelectors from '../selectors';

export const coreFeatureKey = 'core';

export interface CoreState {
  materials: Material[];
  sortedMaterials: SortedMaterials;
  orders: Order[];
  coupons: Coupon[];
}

export const coreReducer = createReducer(
  initialCoreState,
  on(coreActions.setMaterials, (state, action): CoreState => {
    return {
      ...state,
      materials: action.materials
    };
  }),
  on(coreActions.setSortedMaterials, (state, action): CoreState => {
    return {
      ...state,
      sortedMaterials: action.sortedMaterials
    };
  }),
  on(coreActions.setOrders, (state, action): CoreState => {
    return {
      ...state,
      orders: action.orders
    };
  }),
  on(coreActions.addOrder, (state, action): CoreState => {
    console.log(action);
    return {
      ...state,
      orders: [...state.orders, action.order]
    };
  }),
  on(coreActions.setCoupons, (state, action): CoreState => {
    return {
      ...state,
      coupons: action.coupons
    };
  })
);
