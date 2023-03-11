import { MaterialInterface } from '@core/models/material.model';
import { createAction, props } from '@ngrx/store';

import { MaterialsStateInterface } from '../models/materials-state.model';

export enum MaterialActionTypes {
  GET_MATERIALS = '[Material] Get Materials',
  GET_MATERIALS_SUCCESS = '[Material] Get Materials Success',
  GET_MATERIALS_FAILURE = '[Material] Get Materials Failure'
}

export const getMaterials = createAction(MaterialActionTypes.GET_MATERIALS);

export const getMaterialsSuccess = createAction(
  MaterialActionTypes.GET_MATERIALS_SUCCESS,
  props<{ materials: MaterialInterface[] }>()
);

export const getMaterialsFailure = createAction(
  MaterialActionTypes.GET_MATERIALS_FAILURE,
  props<{ error: string }>()
);
