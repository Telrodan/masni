import { User } from '@core/models/user.model';
import { createAction, props } from '@ngrx/store';

export enum UserActionTypes {
  GET_USER = '[User] Get User',
  GET_USER_SUCCESS = '[User] Get User Success'
}

export const getUser = createAction(UserActionTypes.GET_USER);

export const getUserSuccess = createAction(
  UserActionTypes.GET_USER_SUCCESS,
  props<{ user: User }>()
);
