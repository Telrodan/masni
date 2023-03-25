import { User } from '@core/models/user.model';
import { createAction, props } from '@ngrx/store';

export enum UserActionTypes {
  GET_USER = '[User] Get User',
  GET_USER_SUCCESS = '[User] Get User Success',
  GET_USERS = '[User] Get Users',
  DELETE_USER = '[User] Delete User'
}

export const getUser = createAction(UserActionTypes.GET_USER);

export const getUserSuccess = createAction(
  UserActionTypes.GET_USER_SUCCESS,
  props<{ user: User }>()
);

export const getUsers = createAction(
  UserActionTypes.GET_USERS,
  props<{ users: User[] }>()
);

export const deleteUser = createAction(
  UserActionTypes.DELETE_USER,
  props<{ user: User }>()
);
