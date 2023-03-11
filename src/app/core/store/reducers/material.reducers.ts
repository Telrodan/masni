import { createReducer, on } from '@ngrx/store';

import {
  SortedMaterials,
  SortedMaterialsInterface
} from '@core/models/sorted-materials.model';
import { MaterialsStateInterface } from '@core/store/models/materials-state.model';
import {
  getMaterials,
  getMaterialsFailure,
  getMaterialsSuccess
} from '@core/store/actions/';

export const initialState: MaterialsStateInterface = {
  materials: [],
  sortedMaterials: null,
  error: null
};

export const materialReducers = createReducer(
  initialState,
  on(getMaterials, (state) => ({
    ...state
  })),
  on(getMaterialsSuccess, (state, action) => {
    const sortedMaterials: SortedMaterialsInterface =
      SortedMaterials.sortMaterials(action.materials);
    return {
      ...state,
      materials: action.materials,
      sortedMaterials
    };
  }),
  on(getMaterialsFailure, (state, action) => ({
    ...state,
    error: action.error
  }))
);
