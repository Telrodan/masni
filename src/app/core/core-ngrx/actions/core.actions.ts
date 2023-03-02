import { createAction, props } from '@ngrx/store';
import { Material } from '../../models/material.model';
import { Order } from '../../models/order.model';

export const setMaterials = createAction(
  '[Core] Set Materials',
  props<{ materials: Material[] }>()
);

export const setOrders = createAction(
  '[Core] Set Orders',
  props<{ orders: Order[] }>()
);
