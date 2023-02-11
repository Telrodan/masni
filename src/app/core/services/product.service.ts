import { Injectable, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';

import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[];

  constructor(private apiService: ApiService) {}

  public getProducts(): Product[] {
    return this.products;
  }

  public fetchProducts(): Observable<Product[]> {
    return this.apiService.get$<{ products: Product[] }>('products').pipe(
      map((productsDTO) => {
        const products = productsDTO.products.map((rawProduct: any) => {
          return Product.fromDTO(rawProduct);
        });
        this.products = products;
        return this.products;
      })
    );
  }
}
