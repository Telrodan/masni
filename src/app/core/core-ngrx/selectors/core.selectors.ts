import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CoreState } from '../reducers/core.reducers';

export const coreStateKey = 'core';

export const selectCoreState = createFeatureSelector<CoreState>(coreStateKey);

export const selectMaterials = createSelector(
  selectCoreState,
  (core) => core.materials
);

export const selectMaterialNameById = (materialId: string) =>
  createSelector(selectMaterials, (materials) => {
    const material = materials.find((material) => material.id === materialId);
    return material ? material.name : materialId;
  });

export const selectMaterialExtraPriceById = (materialId: string) =>
  createSelector(selectMaterials, (materials) => {
    const material = materials.find((material) => material.id === materialId);
    return material ? material.extra : 0;
  });

export const selectSortedMaterials = createSelector(
  selectCoreState,
  (core) => core.sortedMaterials
);

export const selectOrders = createSelector(
  selectCoreState,
  (core) => core.orders
);
