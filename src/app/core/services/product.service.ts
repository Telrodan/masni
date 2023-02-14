import { Injectable, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';

import { Product } from '../models/product.model';
import { MaterialService } from './material.service';
import { Material } from '../models/material.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private apiService: ApiService,
    private materialService: MaterialService
  ) {}

  public getProductPrice(formValues: any): number {
    let price = 0;
    for (const key in formValues.baseMaterials) {
      if (key !== 'minkyColorBack') {
        const extraPrice = this.materialService.getExtraPriceById(
          formValues.baseMaterials[key]
        );
        price += extraPrice;
      }
    }
    price += formValues.extraOptions?.extraMinkyEarCheckbox ? 400 : 0;
    price += formValues.extraOptions?.nameEmbroideryCheckbox ? 500 : 0;

    return price;
  }

  // public fetchProducts(): Observable<Product[]> {
  //   // return this.apiService.get$<{ products: Product[] }>('products').pipe(
  //   //   map((productsDTO) => {
  //   //     const products = productsDTO.products.map((rawProduct: any) => {
  //   //       return Product.fromDTO(rawProduct);
  //   //     });
  //   //     this.products = products;
  //   //     return this.products;
  //   //   })
  //   // );
  // }
}
