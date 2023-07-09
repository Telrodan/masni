import { createReducer, on } from '@ngrx/store';
import {
  deleteUser,
  getUser,
  getUsers,
  getUsersSuccess,
  getUserSuccess
} from '../actions';

import { UserState } from '../models/user-state.model';
import { formatPhoneNumber } from 'src/app/shared/util/format-phone-number';

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

  on(getUsersSuccess, (state, action) => {
    const users = action.users.map((user) => ({
      ...user,
      phone: formatPhoneNumber(user.phone)
    }));

    return { ...state, users };
  }),

  on(deleteUser, (state, action) => {
    const index = state.users.findIndex((item) => item.id === action.user.id);
    const users = [...state.users];
    users.splice(index, 1);
    return {
      ...state,
      users
    };
  })
);
