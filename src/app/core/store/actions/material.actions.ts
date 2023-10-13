import { createAction, props } from '@ngrx/store';

import { Material } from '@core/models/material.model';
import { Category } from '@core/models/category.model';

export enum MaterialActionTypes {
  GET_MATERIALS = '[Material] Get Materials',
  GET_MATERIALS_SUCCESS = '[Material] Get Materials Success',
  GET_MATERIALS_ERROR = '[Material] Get Materials Error',
  ADD_MATERIAL = '[Material] Add Material',
  UPDATE_MATERIAL = '[Material] Update Material',
  DELETE_MATERIAL = '[Material] Delete Material',
  UPDATE_MATERIALS_CATEGORY = '[Material] Update Materials Category'
}

export const getMaterials = createAction(MaterialActionTypes.GET_MATERIALS);

export const getMaterialsSuccess = createAction(
  MaterialActionTypes.GET_MATERIALS_SUCCESS,
  props<{ materials: Material[] }>()
);

export const getMaterialsError = createAction(
  MaterialActionTypes.GET_MATERIALS_ERROR
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

export const updateMaterialsCategory = createAction(
  MaterialActionTypes.UPDATE_MATERIALS_CATEGORY,
  props<{ category: Category }>()
);
