import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';

import { ApiService } from './api.service';
import { ApiResponse } from '@core/models/api-response.model';
import { MaterialService } from './material.service';
import { Product } from '@core/models/product.model';
import {
  addProduct,
  addProductToCategory,
  deleteProduct,
  deleteProductFromCategory,
  moveProductToCategory,
  updateProduct
} from '@core/store';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private apiService: ApiService,
    private materialService: MaterialService,
    private store: Store
  ) {}

  addProduct$(product: FormData): Observable<Product> {
    return this.apiService
      .post<ApiResponse<Product>>('product/addOne', product)
      .pipe(
        map((productDTO) => productDTO.data),
        tap((product) => {
          this.store.dispatch(addProduct({ product }));
          this.store.dispatch(addProductToCategory({ product }));
        })
      );
  }

  updateProduct$(product: FormData, productId: string): Observable<Product> {
    return this.apiService
      .patch<ApiResponse<Product>>(`product/updateOne/${productId}`, product)
      .pipe(
        map((productDTO) => productDTO.data),
        tap((product) => {
          console.log('BACKEND PRODUCT RESPONSE', product);
          this.store.dispatch(updateProduct({ product }));
          this.store.dispatch(moveProductToCategory({ product }));
        })
      );
  }

  deleteProduct$(product: Product): Observable<null> {
    return this.apiService.delete<null>('product/deleteOne', product.id).pipe(
      tap(() => {
        this.store.dispatch(deleteProduct({ product }));
        this.store.dispatch(deleteProductFromCategory({ product }));
      })
    );
  }

  getProducts(): Observable<Product[]> {
    return this.apiService
      .get<ApiResponse<Product[]>>('product/getAll')
      .pipe(map((productsDTO) => productsDTO.data));
  }

  getProductExtraPrice(productExtra): number {
    let price = 0;

    for (const key in productExtra) {
      if (key !== 'extraMinkyEarsInput' && key !== 'minkyColorBack') {
        const extraPrice = this.materialService.getExtraPriceByName(
          productExtra[key]
        );
        price += extraPrice;
      }
    }
    price += productExtra?.extraMinkyEarsCheckbox ? 400 : 0;
    price += productExtra?.nameEmbroideryCheckbox ? 500 : 0;
    return price;
  }
}
