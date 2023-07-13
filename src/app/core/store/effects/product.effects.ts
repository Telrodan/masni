import { Injectable } from '@angular/core';
import { ProductService } from '@core/services/product.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { getProducts, getProductsError, getProductsSuccess } from '../actions';

@Injectable()
export class ProductEffects {
  constructor(
    private actions$: Actions,
    private productService: ProductService
  ) {}

  getProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getProducts),
      exhaustMap(() =>
        this.productService.getProducts().pipe(
          map((products) => getProductsSuccess({ products })),
          catchError(() => of(getProductsError()))
        )
      )
    )
  );
}
