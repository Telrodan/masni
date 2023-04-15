import { createReducer, on } from '@ngrx/store';
import {
  deleteUser,
  getUser,
  getUsers,
  getUsersSuccess,
  getUserSuccess
} from '../actions';

import { UserState } from '../models/user-state.model';

export const userInitialState: UserState = {
  user: null,
  users: []
};

export const userReducers = createReducer(
  userInitialState,
  on(getUser, (state) => ({ ...state })),

  on(getUserSuccess, (state, action) => ({
    ...state,
    user: action.user
  })),
  on(getUsers, (state) => ({ ...state })),
  on(getUsersSuccess, (state, action) => ({
    ...state,
    users: action.users
  })),

  on(deleteUser, (state, action) => {
    const index = state.users.findIndex((item) => item._id === action.user._id);
    const users = [...state.users];
    users.splice(index, 1);
    return {
      ...state,
      users
    };
  })
);
