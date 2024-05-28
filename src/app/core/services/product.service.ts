import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { ApiResponse } from '@core/models/api-response.model';
import { ApiService } from './api.service';
import { BackendProduct, Product } from '@core/store/product/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    constructor(private apiService: ApiService) {}

    addProduct$(product: BackendProduct): Observable<Product> {
        const productFormData = new FormData();
        productFormData.append('product', JSON.stringify(product));
        product.images.forEach((image: string) => {
            productFormData.append('images', image);
        });

        return this.apiService
            .post<ApiResponse<Product>>('product/addOne', productFormData)
            .pipe(map((productDTO) => productDTO.data));
    }

    updateProduct$(product: BackendProduct, productId: string): Observable<Product> {
        const productFormData = new FormData();
        productFormData.append('product', JSON.stringify(product));
        product.images.forEach((image: string) => {
            productFormData.append('images', image);
        });
        return this.apiService
            .patch<ApiResponse<Product>>(`product/updateOne/${productId}`, productFormData)
            .pipe(map((productDTO) => productDTO.data));
    }

    deleteProduct$(product: Product): Observable<null> {
        return this.apiService.delete<null>('product/deleteOne', product.id);
    }

    getProducts$(): Observable<Product[]> {
        return this.apiService
            .get<ApiResponse<Product[]>>('product/getAllProducts')
            .pipe(map((productsDTO) => productsDTO.data));
    }

    getProductById$(id: string): Observable<Product> {
        console.log(id);
        return this.apiService
            .get<ApiResponse<Product>>(`product/getProductById/${id}`)
            .pipe(map((productDTO) => productDTO.data));
    }

    getDreamItProducts$(): Observable<Product[]> {
        return this.apiService
            .get<ApiResponse<Product[]>>('product/getDreamItProducts')
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
