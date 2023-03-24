import { AppState } from 'src/app/reducer';

import { createSelector } from '@ngrx/store';

export const selectMaterialState = (state: AppState) => state.materials;

export const materialsSelector = createSelector(
  selectMaterialState,
  (state) => state.materials
);
