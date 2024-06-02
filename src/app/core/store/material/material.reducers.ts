import { createReducer, on } from '@ngrx/store';

import { cloneDeep } from 'lodash';

import { MaterialAction } from './material.actions';
import { MaterialState } from './material.model';

export const materialInitialState: MaterialState = {
    materials: [],
    isBusy: false
};

export const materialReducers = createReducer(
    materialInitialState,
    on(MaterialAction.getMaterials, (state) => ({
        ...state,
        isBusy: true
    })),

    on(MaterialAction.getMaterialsSuccess, (state, action) => ({
        ...state,
        materials: [...action.materials],
        isBusy: false
    })),

    on(MaterialAction.addMaterial, (state) => ({
        ...state,
        isBusy: true
    })),

    on(MaterialAction.addMaterialSuccess, (state, action) => ({
        ...state,
        materials: [...state.materials, action.material],
        isBusy: false
    })),

    on(MaterialAction.updateMaterial, (state) => ({
        ...state,
        isBusy: true
    })),

    on(MaterialAction.updateMaterialSuccess, (state, action) => {
        const stateClone = cloneDeep(state);
        const materialIndex = stateClone.materials.findIndex(
            (material) => material.id === action.material.id
        );

        stateClone.materials[materialIndex] = action.material;

        return {
            ...stateClone,
            isBusy: false
        };
    }),

    on(MaterialAction.deleteMaterial, (state) => ({
        ...state,
        isBusy: true
    })),

    on(MaterialAction.deleteMaterialSuccess, (state, action) => ({
        ...state,
        materials: state.materials.filter((material) => material.id !== action.id),
        isBusy: false
    }))
);
