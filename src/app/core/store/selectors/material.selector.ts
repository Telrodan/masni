import { AppState } from 'src/app/reducer';

import { createSelector } from '@ngrx/store';

export const selectMaterialsState = (state: AppState) => state.materials;

export const materialsSelector = (state: AppState) => state.materials.materials;

export const sortedMaterialsSelector = (state: AppState) =>
  state.materials.sortedMaterials;

export const materialsErrorSelector = (state: AppState) =>
  state.materials.error;
