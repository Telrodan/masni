import { Material } from '@core/models/material.model';
import { createAction, props } from '@ngrx/store';

export enum MaterialActionTypes {
  GET_MATERIALS = '[Material] Get Materials',
  GET_MATERIALS_SUCCESS = '[Material] Get Materials Success'
}

export const getMaterials = createAction(MaterialActionTypes.GET_MATERIALS);

export const getMaterialsSuccess = createAction(
  MaterialActionTypes.GET_MATERIALS_SUCCESS,
  props<{ materials: Material[] }>()
);
