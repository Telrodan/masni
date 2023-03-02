import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CoreState } from '../reducers/core.reducers';

export const selectCoreState = createFeatureSelector<CoreState>('core');

export const selectMaterials = createSelector(
  selectCoreState,
  (core) => core.materials
);

export const selectMaterialById = (materialId: string) =>
  createSelector(selectCoreState, (core) => {
    const material = core.materials.find(
      (material) => material.id === materialId
    );
    return material ? material.name : materialId;
  });
