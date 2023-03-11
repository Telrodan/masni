import { Injectable } from '@angular/core';
import { ShoppingCartService } from '@core/services/shopping-cart.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  filter,
  switchMap,
  tap,
  map,
  mergeMap,
  Observable,
  exhaustMap
} from 'rxjs';
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
        this.shoppingCartService.getUserShoppingCartItems().pipe(
          tap((items) => {
            console.log(items);
          }),
          map((shoppingCartItems) =>
            getShoppingCartItemsSuccess({ shoppingCartItems })
          )
        )
      )
    )
  );
}
