import { AppState } from '@core/store/app-state';

import { createSelector } from '@ngrx/store';

export const selectMaterialState = (state: AppState) => state.material;

export const selectAllMaterial = createSelector(
  selectMaterialState,
  (state) => state.materials
);

export const sortedMaterialsSelector = createSelector(
  selectMaterialState,
  (state) => state.sortedMaterials
);

export const materialExtraByNameSelector = (materialName: string) =>
  createSelector(selectAllMaterial, (materials) => {
    const material = materials.find(
      (material) => material.name === materialName
    );
    return material ? material.extra : 0;
  });
