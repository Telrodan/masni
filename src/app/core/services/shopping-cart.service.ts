import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';

import { ApiService } from './api.service';
import { CookieService } from './cookie.service';
import {
  addShoppingCartItem,
  deleteShoppingCartItem
} from '@core/store/actions/shopping-cart.actions';
import { Product } from '@core/models/product.model';
import { ProductExtra } from '@core/models/product-extra.model';
import { ApiResponse } from '@core/models/api-response.model';
import { ShoppingCartItem } from '@core/models/shopping-cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  constructor(private store$: Store, private apiService: ApiService) {}

  addItemToCart(
    product: Product,
    productExtra: ProductExtra
  ): Observable<ShoppingCartItem> {
    const item: ShoppingCartItem = {
      product: product.id,
      price: product.price,
      productExtra
    };

    return this.apiService
      .post<ApiResponse<ShoppingCartItem>>('shoppingCart', item)
      .pipe(
        map((shoppingCartItemDTO) => shoppingCartItemDTO.data),
        tap((item) => {
          this.store$.dispatch(addShoppingCartItem({ item }));
        })
      );
  }

  getUserCartItems(): Observable<ShoppingCartItem[]> {
    return this.apiService
      .get<ApiResponse<ShoppingCartItem[]>>('shoppingCart')
      .pipe(map((cartItemsDTO) => cartItemsDTO.data));
  }

  deleteItemFromCart(item: ShoppingCartItem): Observable<null> {
    return this.apiService.delete<null>('shoppingCart', item._id).pipe(
      tap(() => {
        this.store$.dispatch(deleteShoppingCartItem({ item }));
      })
    );
  }
}
