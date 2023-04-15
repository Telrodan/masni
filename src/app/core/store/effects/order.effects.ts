import { Injectable } from '@angular/core';
import { OrderService } from '@core/services/order.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { getOrders, getOrdersSuccess } from '../actions/order.actions';
import { exhaustMap, map } from 'rxjs';

@Injectable()
export class OrderEffects {
  constructor(private actions$: Actions, private orderService: OrderService) {}

  getMaterials$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getOrders),
      exhaustMap(() =>
        this.orderService
          .getOrders$()
          .pipe(map((orders) => getOrdersSuccess({ orders })))
      )
    )
  );
}
