import { Injectable } from '@angular/core';

import { map, Observable, tap } from 'rxjs';

import { ApiService } from './api.service';
import { MaterialService } from './material.service';
import { Product } from '@core/models/product.model';
import { ApiResponse } from '@core/models/api-response.model';
import { Store } from '@ngrx/store';
import { addProduct, deleteProduct, updateProduct } from '@core/store';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private apiService: ApiService,
    private materialService: MaterialService,
    private store: Store
  ) {}

  addProduct(product: FormData): Observable<Product> {
    return this.apiService
      .post<ApiResponse<Product>>('products/add', product)
      .pipe(
        map((productDTO) => productDTO.data),
        tap((product) => {
          this.store.dispatch(addProduct({ product }));
        })
      );
  }

  updateProduct$(product: Product): Observable<Product> {
    return this.apiService
      .patch<ApiResponse<Product>>(`products/${product._id}`, product)
      .pipe(
        map((productDTO) => productDTO.data),
        tap((product) => {
          this.store.dispatch(updateProduct({ product }));
        })
      );
  }

  deleteProduct$(product: Product): Observable<null> {
    return this.apiService.delete<null>('products', product._id).pipe(
      tap(() => {
        this.store.dispatch(deleteProduct({ product }));
      })
    );
  }

  public getProducts(): Observable<Product[]> {
    return this.apiService
      .get<ApiResponse<Product[]>>('products/getAll')
      .pipe(map((response) => response.data));
  }

  getProductExtraPrice(productExtra): number {
    let price = 0;

    for (const key in productExtra) {
      if (key !== 'extraMinkyEarsInput' && key !== 'minkyColorBack') {
        console.log(key);
        const extraPrice = this.materialService.getExtraPriceByName(
          productExtra[key]
        );
        price += extraPrice;
        console.log(price);
      }
    }
    price += productExtra?.extraMinkyEarsCheckbox ? 400 : 0;
    price += productExtra?.nameEmbroideryCheckbox ? 500 : 0;
    return price;
  }
}
