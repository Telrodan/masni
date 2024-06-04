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

    selectMaterialsByCategoryId: (categoryId: string) =>
        createSelector(selectMaterialState, (materialState) =>
            materialState.materials.filter((material) => material.category.id === categoryId)
        ),

    isBusy: () =>
        createSelector(selectMaterialState, (materialState): boolean => materialState.isBusy)
};
