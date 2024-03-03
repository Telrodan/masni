import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';

import { RawProduct, Product } from '@core/models/product.model';
import { ApiResponse } from '@core/models/api-response.model';
import { ApiService } from './api.service';
import {
  addProduct,
  addItemToCategory,
  deleteProduct,
  deleteItemFromCategory,
  moveItemBetweenCategories,
  updateProduct
} from '@core/store';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private apiService: ApiService, private store: Store) {}

  addProduct$(product: RawProduct): Observable<Product> {
    const productFormData = new FormData();
    productFormData.append('product', JSON.stringify(product));
    product.images.forEach((image: string) => {
      productFormData.append('images', image);
    });

    return this.apiService
      .post<ApiResponse<Product>>('product/addOne', productFormData)
      .pipe(
        map((productDTO) => productDTO.data),
        tap((product) => {
          this.store.dispatch(addProduct({ product }));
          this.store.dispatch(
            addItemToCategory({
              item: product
            })
          );
        })
      );
  }

  updateProduct$(product: RawProduct, productId: string): Observable<Product> {
    const productFormData = new FormData();
    productFormData.append('product', JSON.stringify(product));
    product.images.forEach((image: string) => {
      productFormData.append('images', image);
    });
    return this.apiService
      .patch<ApiResponse<Product>>(
        `product/updateOne/${productId}`,
        productFormData
      )
      .pipe(
        map((productDTO) => productDTO.data),
        tap((product) => {
          this.store.dispatch(updateProduct({ product }));
          this.store.dispatch(
            moveItemBetweenCategories({
              item: product
            })
          );
        })
      );
  }

  deleteProduct$(product: Product): Observable<null> {
    return this.apiService.delete<null>('product/deleteOne', product.id).pipe(
      tap(() => {
        this.store.dispatch(deleteProduct({ product }));
        this.store.dispatch(deleteItemFromCategory({ item: product }));
      })
    );
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
