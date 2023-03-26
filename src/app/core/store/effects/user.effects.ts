import { Injectable } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map } from 'rxjs';
import { getUser, getUserSuccess } from '../actions';

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
}
