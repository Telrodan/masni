import { createReducer, on } from '@ngrx/store';

import { SortedMaterials } from '@core/models/sorted-materials.model';
import { MaterialState } from '@core/store/models/material-state.model';
import {
  addMaterial,
  deleteMaterial,
  getMaterials,
  getMaterialsError,
  getMaterialsSuccess,
  updateMaterial
} from '@core/store/actions/';
import { Material } from '@core/models/material.model';
import { StatusTypes } from '../status-types';

export const materialInitialState: MaterialState = {
  materials: [],
  availableMaterials: [],
  sortedMaterials: null,
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

    const sortedMaterials: SortedMaterials =
      SortedMaterials.sortMaterials(availableMaterials);

    return {
      ...state,
      materials: [...action.materials],
      availableMaterials,
      sortedMaterials,
      status: StatusTypes.LOADED
    };
  }),

  on(getMaterialsError, (state) => ({
    ...state,
    status: StatusTypes.ERROR
  })),

  on(addMaterial, (state, action) => {
    const sortedMaterials = JSON.parse(JSON.stringify(state.sortedMaterials));

    for (const key in sortedMaterials) {
      if (key === action.material.category) {
        sortedMaterials[key] = [...sortedMaterials[key], action.material];
      }
    }

    return {
      ...state,
      sortedMaterials,
      materials: [...state.materials, action.material]
    };
  }),
  on(updateMaterial, (state, action) => {
    const materialIndex = state.materials.findIndex(
      (material) => material.id === action.material.id
    );

    const materials = [...state.materials];
    materials.splice(materialIndex, 1, action.material);

    const sortedMaterials = JSON.parse(JSON.stringify(state.sortedMaterials));

    for (const key in sortedMaterials) {
      if (key === action.material.category) {
        const sortedMaterialIndex = sortedMaterials[key].findIndex(
          (material: Material) => material.id === action.material.id
        );
        sortedMaterials[key].splice(sortedMaterialIndex, 1, action.material);
      }
    }

    return {
      ...state,
      materials,
      sortedMaterials
    };
  }),
  on(deleteMaterial, (state, action) => {
    const materialIndex = state.materials.findIndex(
      (material) => material.id === action.material.id
    );

    const materials = [...state.materials];
    materials.splice(materialIndex, 1);

    const sortedMaterials = JSON.parse(JSON.stringify(state.sortedMaterials));

    for (const key in sortedMaterials) {
      if (key === action.material.category) {
        const sortedMaterialIndex = sortedMaterials[key].findIndex(
          (material: Material) => material.id === action.material.id
        );
        sortedMaterials[key].splice(sortedMaterialIndex, 1);
      }
    }

    return {
      ...state,
      materials,
      sortedMaterials
    };
  })
);
