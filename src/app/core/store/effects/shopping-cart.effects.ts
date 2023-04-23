import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, exhaustMap } from 'rxjs';

import { ShoppingCartService } from '@core/services/shopping-cart.service';
import {
  getShoppingCartItems,
  getShoppingCartItemsSuccess
} from '../actions/shopping-cart.actions';

@Injectable()
export class ShoppingCartEffects {
  constructor(
    private actions$: Actions,
    private shoppingCartService: ShoppingCartService
  ) {}

  getShoppingCartItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getShoppingCartItems),
      exhaustMap(() =>
        this.shoppingCartService.getUserCartItems().pipe(
          map((items) => {
            return getShoppingCartItemsSuccess({ items });
          })
        )
      )
    )
  );
}
