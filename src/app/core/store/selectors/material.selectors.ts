import { AppState } from '@core/store/app-state';

import { createSelector } from '@ngrx/store';

export const selectMaterialState = (state: AppState) => state.material;

export const selectAllMaterials = createSelector(
  selectMaterialState,
  (state) => state.materials
);

export const selectAvailableMaterials = createSelector(
  selectMaterialState,
  (state) => state.materials.filter((material) => material.isAvailable)
);

export const selectMaterialsByCategoryId = (id: string) =>
  createSelector(selectAllMaterials, (materials) =>
    materials.filter((material) => material.category.id === id)
  );

export const selectMaterialsByCategoryIds = (ids: string[]) =>
  createSelector(selectAllMaterials, (materials) =>
    materials.filter((material) => ids.includes(material.category.id))
  );

// TODO: check this later
export const selectMaterialExtraById = (id: string) =>
  createSelector(selectAllMaterials, (materials) => {
    const material = materials.find((material) => material.id === id);
    return material.extraPrice;
  });
