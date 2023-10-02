import { createReducer, on } from '@ngrx/store';
import * as _ from 'lodash';

import { Category } from '@core/models/category.model';
import { InspirationState } from '@core/store/models/inspiration-state.model';
import {
  addInspiration,
  deleteInspiration,
  getInspirations,
  getInspirationsError,
  getInspirationsSuccess,
  updateInspiration,
  updateInspirationsCategory
} from '@core/store/actions';
import { StatusTypes } from '../status-types';

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

  on(getInspirationsError, (state) => ({
    ...state,
    status: StatusTypes.ERROR
  })),

  on(addInspiration, (state, action) => ({
    ...state,
    inspirations: [...state.inspirations, action.inspiration]
  })),

  on(updateInspiration, (state, action) => ({
    ...state,
    inspirations: state.inspirations.map((inspiration) =>
      inspiration.id === action.inspiration.id
        ? action.inspiration
        : inspiration
    )
  })),

  on(deleteInspiration, (state, action) => {
    return {
      ...state,
      inspirations: state.inspirations.filter(
        (inspiration) => inspiration.id !== action.id
      )
    };
  }),

  on(updateInspirationsCategory, (state, action) => {
    const inspirations = _.cloneDeep(state.inspirations);

    inspirations.forEach((inspiration) => {
      if ((inspiration.category as Category).id === action.category.id) {
        inspiration.category = action.category;
      }
    });

    return {
      ...state,
      inspirations
    };
  })
);
