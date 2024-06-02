import { AppState } from '../app-state.model';
import { createSelector } from '@ngrx/store';

const selectMaterialState = (state: AppState) => state.material;

export const MaterialSelector = {
    selectMaterials: () =>
        createSelector(selectMaterialState, (materialState) => materialState.materials),

    selectMaterialById: (id: string) =>
        createSelector(selectMaterialState, (materialState) =>
            materialState.materials.find((material) => material.id === id)
        ),

    isBusy: () =>
        createSelector(selectMaterialState, (materialState): boolean => materialState.isBusy)
};
