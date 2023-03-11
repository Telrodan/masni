import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { filter, map, Observable, tap } from 'rxjs';
import { RawBuiltShoppingCartProductInterface } from '../models/product.model';
import { ApiService } from './api.service';

import { CookieService } from './cookie.service';
import { MessageService } from 'primeng/api';
import {
  addProduct,
  deleteProductFromCart,
  setUserShoppingCart
} from '@core/store';
import { ShoppingCartItem } from '@core/models/shopping-cart.model';

interface ProductBackendInterface {
  data: {
    product: ShoppingCartItem;
  };
}

interface ShoppingCartItemsDTO {
  data: {
    shoppingCartItems: ShoppingCartItem[];
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

  public getUserShoppingCartItems(): Observable<ShoppingCartItem[]> {
    const ownerId = this.cookieService.getCookie('userId');
    return this.apiService
      .get<ShoppingCartItemsDTO>('shopping-cart/get-user-items', ownerId)
      .pipe(map((items) => items.data.shoppingCartItems));
  }

  // public setUserShoppingCartProductsStore(): Observable<
  //   RawBuiltShoppingCartProductInterface[]
  // > {
  //   const userId = this.cookieService.getCookie('userId');
  //   return this.apiService
  //     .get<ProductsBackendInterface>('shopping-cart/get-user-products', {
  //       ownerId: userId
  //     })
  //     .pipe(
  //       map((productsDTO) => {
  //         const products: ShoppingCartProductInterface[] =
  //           productsDTO.data.products;
  //         return products;
  //       }),
  //       filter((products) => !!products),
  //       tap((products) => {
  //         this.store$.dispatch(setUserShoppingCart({ products }));
  //       })
  //     );
  // }

  public addBuiltProductToCart(
    rawProduct: RawBuiltShoppingCartProductInterface
  ): void {
    const userId = this.cookieService.getCookie('userId');
    const product: ShoppingCartItem = {
      ownerId: userId,
      productName: rawProduct.baseMaterials.baseProduct,
      productComment: rawProduct.extraOptions.productComment,
      productDetails: {
        baseProduct: rawProduct.baseMaterials.baseProduct,
        baseColor: rawProduct.baseMaterials.baseColor,
        szundikendoColor: rawProduct.baseMaterials.szundikendoColor,
        minkyColorBack: rawProduct.baseMaterials.minkyColorBack,
        earsColor: rawProduct.baseMaterials.earsColor,
        ribbonColor: rawProduct.baseMaterials.ribbonColor,
        isExtraMinkyEars: rawProduct.extraOptions.extraMinkyEarsCheckbox,
        minkyEarsColor: rawProduct.extraOptions.extraMinkyEarsInput,
        isExtraNameEmbroidery: rawProduct.extraOptions.nameEmbroideryCheckbox,
        nameEmbroideryText: rawProduct.extraOptions.nameEmbroideryInput
      },
      productPrice: rawProduct.price
    };

    console.log(product);

    this.apiService
      .post<ProductBackendInterface>('shopping-cart/add', product)
      .pipe(
        tap((productDTO) => {
          const product: ShoppingCartItem = productDTO.data.product;
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

  public deleteProductFromCart(product: ShoppingCartItem): void {
    this.store$.dispatch(deleteProductFromCart({ product }));
    this.apiService.delete('shopping-cart', product._id).subscribe();
  }
}
