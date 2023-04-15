import { Injectable } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map } from 'rxjs';
import { getUser, getUserSuccess, getUsers, getUsersSuccess } from '../actions';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService) {}

  getUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUser),
      exhaustMap(() =>
        this.userService
          .getUser$()
          .pipe(map((user) => getUserSuccess({ user })))
      )
    )
  );

  getUsers = createEffect(() =>
    this.actions$.pipe(
      ofType(getUsers),
      exhaustMap(() =>
        this.userService
          .getUsers$()
          .pipe(map((users) => getUsersSuccess({ users })))
      )
    )
  );
}
