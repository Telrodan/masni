import { createReducer, on } from '@ngrx/store';

import { SortedMaterials } from '@core/models/sorted-materials.model';
import { MaterialState } from '@core/store/models/material-state.model';
import { getMaterials, getMaterialsSuccess } from '@core/store/actions/';

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
  })
);
