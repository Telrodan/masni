import { createReducer, on } from '@ngrx/store';
import { Coupon } from '../../models/coupon.mode';
import { Material } from '../../models/material.model';
import { Order } from '../../models/order.model';
import coreActions from '../actions';
import { initialCoreState } from '../initial-state/core.initial-state';

export const coreFeatureKey = 'core';

export interface CoreState {
  materials: Material[];
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
  })
);
