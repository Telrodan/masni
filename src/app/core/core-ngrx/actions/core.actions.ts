import { createAction, props } from '@ngrx/store';
import { Coupon } from '../../models/coupon.mode';
import { Material } from '../../models/material.model';
import { Order } from '../../models/order.model';
import { SortedMaterials } from '../../models/sorted-materials.model';

export const setMaterials = createAction(
  '[Core] Set Materials',
  props<{ materials: Material[] }>()
);

export const setSortedMaterials = createAction(
  '[Core] Set Sorted Materials',
  props<{ sortedMaterials: SortedMaterials }>()
);

export const setOrders = createAction(
  '[Core] Set Orders',
  props<{ orders: Order[] }>()
);

export const addOrder = createAction(
  '[Core] Add Order',
  props<{ order: Order }>()
);

export const deleteOrder = createAction(
  '[Core] Delete Order',
  props<{ order: Order[] }>()
);

export const setCoupons = createAction(
  '[Core] Set Coupons',
  props<{ coupons: Coupon[] }>()
);
