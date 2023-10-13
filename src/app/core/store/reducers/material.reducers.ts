import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';

import { Category } from '@core/models/category.model';
import { MaterialState } from '@core/store/models/material-state.model';
import {
  addMaterial,
  deleteMaterial,
  getMaterials,
  getMaterialsError,
  getMaterialsSuccess,
  updateMaterial,
  updateMaterialsCategory
} from '@core/store/actions/';
import { StatusTypes } from '../status-types';

export const materialInitialState: MaterialState = {
  materials: [],
  status: StatusTypes.INIT
};

export const materialReducers = createReducer(
  materialInitialState,

  on(getMaterials, (state) => ({
    ...state,
    status: StatusTypes.LOADING
  })),

  on(getMaterialsSuccess, (state, action) => ({
    ...state,
    materials: [...action.materials],
    status: StatusTypes.LOADED
  })),

  on(getMaterialsError, (state) => ({
    ...state,
    status: StatusTypes.ERROR
  })),

  on(addMaterial, (state, action) => ({
    ...state,
    materials: [...state.materials, action.material]
  })),

  on(updateMaterial, (state, action) => ({
    ...state,
    materials: state.materials.map((material) =>
      material.id === action.material.id ? action.material : material
    )
  })),

  on(deleteMaterial, (state, action) => ({
    ...state,
    materials: state.materials.filter(
      (material) => material.id !== action.material.id
    )
  })),

  on(updateMaterialsCategory, (state, action) => {
    const materials = _.cloneDeep(state.materials);

    materials.forEach((material) => {
      if (material.category.id === action.category.id) {
        material.category = action.category;
      }
    });

    return {
      ...state,
      materials
    };
  })
);
