import { Injectable } from '@angular/core';
import { OrderService } from '@core/services/order.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  getOrders,
  getOrdersError,
  getOrdersSuccess
} from '../actions/order.actions';
import { catchError, exhaustMap, map, of } from 'rxjs';

@Injectable()
export class OrderEffects {
  constructor(private actions$: Actions, private orderService: OrderService) {}

  getOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getOrders),
      exhaustMap(() =>
        this.orderService.getOrders$().pipe(
          map((orders) => getOrdersSuccess({ orders })),
          catchError(() => of(getOrdersError()))
        )
      )
    )
  );
}
