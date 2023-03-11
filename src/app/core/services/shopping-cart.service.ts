import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { filter, map, Observable, tap } from 'rxjs';
import {
  ProductInterface,
  RawBuiltProductInterface
} from '../models/product.model';
import { ApiService } from './api.service';

import { CookieService } from './cookie.service';
import { MessageService } from 'primeng/api';
import {
  addProduct,
  deleteProductFromCart,
  setUserShoppingCart
} from '@core/store';

interface ProductBackendInterface {
  data: {
    product: ProductInterface;
  };
}

interface ProductsBackendInterface {
  data: {
    products: ProductInterface[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  constructor(
    private cookieService: CookieService,
    private store$: Store,
    private apiService: ApiService,
    private messageService: MessageService
  ) {}

  public setUserShoppingCartProductsStore(): Observable<ProductInterface[]> {
    const userId = this.cookieService.getCookie('userId');
    return this.apiService
      .get<ProductsBackendInterface>('shopping-cart/get-user-products', {
        ownerId: userId
      })
      .pipe(
        map((productsDTO) => {
          const products: ProductInterface[] = productsDTO.data.products;
          return products;
        }),
        filter((products) => !!products),
        tap((products) => {
          this.store$.dispatch(setUserShoppingCart({ products }));
        })
      );
  }

  public addBuiltProductToCart(rawProduct: RawBuiltProductInterface): void {
    const userId = this.cookieService.getCookie('userId');
    const product: ProductInterface = {
      ownerId: userId,
      productName: rawProduct.baseMaterials.baseProduct,
      productComment: rawProduct.extraOptions.comment,
      productDetails: {
        baseProduct: rawProduct.baseMaterials.baseProduct,
        baseColor: rawProduct.baseMaterials.baseColor,
        szundikendoColor: rawProduct.baseMaterials.szundikendoColor,
        minkyColorBack: rawProduct.baseMaterials.minkyColorBack,
        earsColor: rawProduct.baseMaterials.earsColor,
        ribbonColor: rawProduct.baseMaterials.ribbonColor,
        isExtraMinkyEars: rawProduct.extraOptions.extraMinkyEarCheckbox,
        minkyEarsColor: rawProduct.extraOptions.extraMinkyEarInput,
        isExtraNameEmbroidery: rawProduct.extraOptions.nameEmbroideryCheckbox,
        nameEmbroideryText: rawProduct.extraOptions.nameEmbroideryInput
      },
      productPrice: rawProduct.price
    };

    this.apiService
      .post<ProductBackendInterface>('shopping-cart/add', product)
      .pipe(
        tap((productDTO) => {
          const product: ProductInterface = productDTO.data.product;
          this.store$.dispatch(addProduct({ product }));

          const productName =
            product.productName.charAt(0).toUpperCase() +
            product.productName.slice(1);
          this.messageService.add({
            severity: 'success',
            summary: 'Siker!',
            detail: `${
              productName + ` hozzáadva, ${product.productPrice} Ft értékben.`
            }`
          });
        })
      )
      .subscribe();
  }

  public addReadyProductToCart(): void {}

  public deleteProductFromCart(product: ProductInterface): void {
    this.store$.dispatch(deleteProductFromCart({ product }));
    this.apiService.delete('shopping-cart', product._id).subscribe();
  }
}
