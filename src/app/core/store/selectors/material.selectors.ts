import { AppState } from 'src/app/reducer';

import { createSelector } from '@ngrx/store';

export const selectMaterialState = (state: AppState) => state.material;

export const materialsSelector = createSelector(
  selectMaterialState,
  (state) => state.materials
);

export const sortedMaterialsSelector = createSelector(
  selectMaterialState,
  (state) => state.sortedMaterials
);

export const materialExtraByNameSelector = (materialName: string) =>
  createSelector(materialsSelector, (materials) => {
    const material = materials.find(
      (material) => material.name === materialName
    );
    return material ? material.extra : 0;
  });
