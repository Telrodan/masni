import { createReducer, on } from '@ngrx/store';
import { InspirationState } from '../models/inspiration-state.model';
import { StatusTypes } from '../status-types';
import {
  addInspiration,
  deleteInspiration,
  getInspirations,
  getInspirationsSuccess,
  updateInspiration
} from '../actions';

export const inspirationInitialState: InspirationState = {
  inspirations: [],
  status: StatusTypes.INIT
};

export const inspirationReducers = createReducer(
  inspirationInitialState,
  on(getInspirations, (state) => ({
    ...state,
    status: StatusTypes.LOADING
  })),

  on(getInspirationsSuccess, (state, action) => ({
    ...state,
    inspirations: action.inspirations,
    status: StatusTypes.LOADED
  })),

  on(addInspiration, (state, action) => ({
    ...state,
    inspirations: [...state.inspirations, action.inspiration]
  })),

  on(updateInspiration, (state, action) => {
    const index = state.inspirations.findIndex(
      (inspiration) => inspiration.id === action.inspiration.id
    );
    const inspirations = [...state.inspirations];
    inspirations.splice(index, 1, action.inspiration);
    return {
      ...state,
      inspirations
    };
  }),

  on(deleteInspiration, (state, action) => {
    const index = state.inspirations.findIndex((item) => item.id === action.id);
    const inspirations = [...state.inspirations];
    inspirations.splice(index, 1);
    return {
      ...state,
      inspirations
    };
  })
);
