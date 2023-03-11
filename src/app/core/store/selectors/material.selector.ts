import { AppState } from 'src/app/reducer';

import { createSelector } from '@ngrx/store';

export const selectMaterialsState = (state: AppState) => state.materials;

export const materialsSelector = createSelector(
  selectMaterialsState,
  (state) => state.materials
);

export const sortedMaterialsSelector = createSelector(
  selectMaterialsState,
  (state) => state.sortedMaterials
);

export const materialExtraByNameSelector = (materialName: string) =>
  createSelector(materialsSelector, (materials) => {
    const material = materials.find(
      (material) => material.name === materialName
    );
    return material ? material.extra : 0;
  });
