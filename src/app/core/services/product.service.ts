import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { ApiService } from './api.service';
import { MaterialService } from './material.service';
import { Product, ProductsDTO } from '@core/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private apiService: ApiService,
    private materialService: MaterialService
  ) {}

  public getProducts(): Observable<Product[]> {
    return this.apiService
      .get<ProductsDTO>('products/get')
      .pipe(map((productsDTO) => productsDTO.data.products));
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
