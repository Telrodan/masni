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

  public getProductPrice(formValues: any): number {
    let price = 0;

    // Ready product price check
    for (const key in formValues) {
      const extraPrice = this.materialService.getExtraPriceByName(
        formValues[key]
      );
      price += extraPrice;
    }

    for (const key in formValues.baseMaterials) {
      if (key !== 'minkyColorBack') {
        const extraPrice = this.materialService.getExtraPriceByName(
          formValues.baseMaterials[key]
        );
        price += extraPrice;
      }
    }
    price += formValues.extraOptions?.extraMinkyEarsCheckbox ? 400 : 0;
    price += formValues.extraOptions?.nameEmbroideryCheckbox ? 500 : 0;
    price += formValues?.nameEmbroideryCheckbox ? 500 : 0;
    return price;
  }
}
