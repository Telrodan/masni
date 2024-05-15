import { Injectable } from '@angular/core';

import { map, Observable, of, tap } from 'rxjs';

import { ApiService } from './api.service';
import { ApiResponse } from '@core/models/api-response.model';
import {
    BackendShoppingCartItem,
    ShoppingCartItem
} from '@core/models/shopping-cart-item.model';

const ROUTE_SUFFIX = 'shoppingCart';

@Injectable({
    providedIn: 'root'
})
export class ShoppingCartService {
    constructor(private apiService: ApiService) {}

    addItem$(item: BackendShoppingCartItem): Observable<void> {
        return this.apiService.post<void>(`${ROUTE_SUFFIX}/addItem`, { item });
    }

    deleteItem$(item: ShoppingCartItem): Observable<void> {
        return this.apiService.delete<void>(
            `${ROUTE_SUFFIX}/deleteOne`,
            item.id
        );
    }

    getItems$(): Observable<ShoppingCartItem[]> {
        return this.apiService
            .get<ApiResponse<ShoppingCartItem[]>>(`${ROUTE_SUFFIX}/getItems`)
            .pipe(map((cartItemsDTO) => cartItemsDTO.data));
    }
}
