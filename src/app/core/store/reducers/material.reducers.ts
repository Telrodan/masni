import { createReducer, on } from '@ngrx/store';

import { SortedMaterials } from '@core/models/sorted-materials.model';
import { MaterialState } from '@core/store/models/material-state.model';
import {
  addMaterial,
  deleteMaterial,
  getMaterials,
  getMaterialsSuccess,
  updateMaterial
} from '@core/store/actions/';
import { Material } from '@core/models/material.model';

export const materialInitialState: MaterialState = {
  materials: [],
  sortedMaterials: null
};

export const materialReducers = createReducer(
  materialInitialState,
  on(getMaterials, (state) => ({
    ...state
  })),
  on(getMaterialsSuccess, (state, action) => {
    const sortedMaterials: SortedMaterials = SortedMaterials.sortMaterials(
      action.materials
    );

    return {
      ...state,
      materials: action.materials,
      sortedMaterials
    };
  }),
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
      (material) => material._id === action.material._id
    );

    const materials = [...state.materials];
    materials.splice(materialIndex, 1, action.material);

    const sortedMaterials = JSON.parse(JSON.stringify(state.sortedMaterials));

    for (const key in sortedMaterials) {
      if (key === action.material.category) {
        const sortedMaterialIndex = sortedMaterials[key].findIndex(
          (material: Material) => material._id === action.material._id
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
      (material) => material._id === action.material._id
    );

    const materials = [...state.materials];
    materials.splice(materialIndex, 1);

    const sortedMaterials = JSON.parse(JSON.stringify(state.sortedMaterials));

    for (const key in sortedMaterials) {
      if (key === action.material.category) {
        const sortedMaterialIndex = sortedMaterials[key].findIndex(
          (material: Material) => material._id === action.material._id
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
