import { createReducer, on } from '@ngrx/store';
import { getUser, getUserSuccess } from '../actions';

import { UserState } from '../models/user-state.model';

export const userInitialState: UserState = {
  user: null
};

export const userReducers = createReducer(
  userInitialState,
  on(getUser, (state) => ({ ...state })),
  on(getUserSuccess, (state, action) => ({
    ...state,
    user: action.user
  }))
);
