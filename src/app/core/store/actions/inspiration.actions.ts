import { createAction, props } from '@ngrx/store';

import { Inspiration } from '@core/models/inspiration.model';

export enum InspirationActionsTypes {
  GET_INSPIRATIONS = '[Inspiration] Get Inspirations',
  GET_INSPIRATIONS_SUCCESS = '[Inspiration] Get Inspirations Success',
  GET_INSPIRATIONS_ERROR = '[Inspiration] Get Inspirations Error',
  ADD_INSPIRATION = '[Inspiration] Add Inspiration',
  UPDATE_INSPIRATION = '[Inspiration] Update Inspiration',
  DELETE_INSPIRATION = '[Inspiration] Delete Inspiration'
}

export const getInspirations = createAction(
  InspirationActionsTypes.GET_INSPIRATIONS
);

export const getInspirationsSuccess = createAction(
  InspirationActionsTypes.GET_INSPIRATIONS_SUCCESS,
  props<{ inspirations: Inspiration[] }>()
);

export const getInspirationsError = createAction(
  InspirationActionsTypes.GET_INSPIRATIONS_ERROR
);

export const addInspiration = createAction(
  InspirationActionsTypes.ADD_INSPIRATION,
  props<{ inspiration: Inspiration }>()
);

export const updateInspiration = createAction(
  InspirationActionsTypes.UPDATE_INSPIRATION,
  props<{ inspiration: Inspiration }>()
);

export const deleteInspiration = createAction(
  InspirationActionsTypes.DELETE_INSPIRATION,
  props<{ id: string }>()
);
