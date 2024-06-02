import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { ApiResponse } from '@core/models/api-response.model';
import { ApiService } from './api.service';
import { Product } from '@core/store/product/product.model';
import { createFormDataFromObject } from '@shared/util/create-form-data-from-object.util';

const ROUTE_PREFIX = 'products';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    constructor(private apiService: ApiService) {}

    addProduct$(product: Product): Observable<Product> {
        const productFormData = createFormDataFromObject(product);

        return this.apiService
            .post<ApiResponse<Product>>(`${ROUTE_PREFIX}/addOne`, productFormData)
            .pipe(map((productDTO) => productDTO.data));
    }

    updateProduct$(product: Product): Observable<Product> {
        const productFormData = createFormDataFromObject(product);

        return this.apiService
            .patch<ApiResponse<Product>>(`${ROUTE_PREFIX}/updateOne/${product.id}`, productFormData)
            .pipe(map((productDTO) => productDTO.data));
    }

    deleteProduct$(id: string): Observable<null> {
        return this.apiService.delete<null>(`${ROUTE_PREFIX}/deleteOne`, id);
    }

    getProducts$(): Observable<Product[]> {
        return this.apiService
            .get<ApiResponse<Product[]>>(`${ROUTE_PREFIX}/getAll`)
            .pipe(map((productsDTO) => productsDTO.data));
    }

    likeProduct$(productId: string): Observable<Product> {
        return this.apiService
            .patch<ApiResponse<Product>>(`product/likeProduct/${productId}`, {
                id: productId
            })
            .pipe(map((productDTO) => productDTO.data));
    }
}
