import { Injectable } from '@angular/core';

import { map, Observable, tap } from 'rxjs';

import { ApiService } from './api.service';
import { ApiResponse } from '@core/models/api-response.model';
import { ShoppingCartItem } from '@core/models/shopping-cart-item.model';

@Injectable({
    providedIn: 'root'
})
export class ShoppingCartService {
    constructor(private apiService: ApiService) {}

    addItemToCart(cartItem: ShoppingCartItem): Observable<ShoppingCartItem> {
        return this.apiService
            .post<ApiResponse<ShoppingCartItem>>('shoppingCart', { cartItem })
            .pipe(map((shoppingCartItemDTO) => shoppingCartItemDTO.data));
    }

    getUserCartItems(): Observable<ShoppingCartItem[]> {
        return this.apiService
            .get<ApiResponse<ShoppingCartItem[]>>('shoppingCart')
            .pipe(map((cartItemsDTO) => cartItemsDTO.data));
    }

    deleteItemFromCart(item: ShoppingCartItem): Observable<null> {
        return this.apiService.delete<null>('shoppingCart', item.id).pipe();
    }
}
