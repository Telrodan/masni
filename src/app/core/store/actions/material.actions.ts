import { Material } from '@core/models/material.model';
import { createAction, props } from '@ngrx/store';

export enum MaterialActionTypes {
  GET_MATERIALS = '[Material] Get Materials',
  GET_MATERIALS_SUCCESS = '[Material] Get Materials Success',
  ADD_MATERIAL = '[Material] Add Material',
  UPDATE_MATERIAL = '[Material] Update Material',
  DELETE_MATERIAL = '[Material] Delete Material'
}

export const getMaterials = createAction(MaterialActionTypes.GET_MATERIALS);

export const getMaterialsSuccess = createAction(
  MaterialActionTypes.GET_MATERIALS_SUCCESS,
  props<{ materials: Material[] }>()
);

export const addMaterial = createAction(
  MaterialActionTypes.ADD_MATERIAL,
  props<{ material: Material }>()
);

export const updateMaterial = createAction(
  MaterialActionTypes.UPDATE_MATERIAL,
  props<{ material: Material }>()
);

export const deleteMaterial = createAction(
  MaterialActionTypes.DELETE_MATERIAL,
  props<{ material: Material }>()
);
