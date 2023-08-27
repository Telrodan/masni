import { createReducer, on } from '@ngrx/store';

import { MaterialState } from '@core/store/models/material-state.model';
import {
  addMaterial,
  deleteMaterial,
  getMaterials,
  getMaterialsError,
  getMaterialsSuccess,
  updateMaterial
} from '@core/store/actions/';
import { StatusTypes } from '../status-types';

export const materialInitialState: MaterialState = {
  materials: [],
  availableMaterials: [],
  status: StatusTypes.INIT
};

export const materialReducers = createReducer(
  materialInitialState,
  on(getMaterials, (state) => ({
    ...state,
    status: StatusTypes.LOADING
  })),

  on(getMaterialsSuccess, (state, action) => {
    const availableMaterials = action.materials.filter(
      (material) => material.isAvailable
    );

    return {
      ...state,
      materials: [...action.materials],
      availableMaterials,
      status: StatusTypes.LOADED
    };
  }),

  on(getMaterialsError, (state) => ({
    ...state,
    status: StatusTypes.ERROR
  })),

  on(addMaterial, (state, action) => ({
    ...state,
    materials: [...state.materials, action.material],
    availableMaterials: action.material.isAvailable
      ? [...state.availableMaterials, action.material]
      : [...state.availableMaterials]
  })),

  on(updateMaterial, (state, action) => {
    const index = state.materials.findIndex(
      (material) => material.id === action.material.id
    );

    const materials = [...state.materials];
    const availableMaterials = [...state.availableMaterials];

    materials.splice(index, 1, action.material);

    if (action.material.isAvailable) {
      const index = availableMaterials.findIndex(
        (material) => material.id === action.material.id
      );
      availableMaterials.splice(index, 1, action.material);
    }

    return {
      ...state,
      materials,
      availableMaterials
    };
  }),

  on(deleteMaterial, (state, action) => {
    const index = state.materials.findIndex(
      (material) => material.id === action.material.id
    );

    const materials = [...state.materials];
    const availableMaterials = [...state.availableMaterials];

    materials.splice(index, 1);

    if (action.material.isAvailable) {
      const index = availableMaterials.findIndex(
        (material) => material.id === action.material.id
      );
      availableMaterials.splice(index, 1);
    }

    return {
      ...state,
      materials
    };
  })
);
