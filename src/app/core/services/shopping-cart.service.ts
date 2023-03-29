import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';
import { MessageService } from 'primeng/api';

import { ApiService } from './api.service';
import { CookieService } from './cookie.service';
import {
  addShoppingCartItem,
  deleteShoppingCartItem
} from '@core/store/actions/shopping-cart.actions';
import { BuiltProduct, Product } from '@core/models/product.model';
import { ProductExtra } from '@core/models/product-extra.model';
import { ApiResponse } from '@core/models/api-response.model';
import { ShoppingCartItem } from '@core/models/shopping-cart-item.model';

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

  addItemToCart(
    product: Product,
    productExtra: ProductExtra
  ): Observable<ShoppingCartItem> {
    const item: ShoppingCartItem = {
      product: product._id,
      price: product.price,
      productExtra
    };

    return this.apiService
      .post<ApiResponse<ShoppingCartItem>>('shoppingCart', item)
      .pipe(
        map((shoppingCartItemDTO) => shoppingCartItemDTO.data),
        tap((shoppingCartItem) => {
          this.store$.dispatch(addShoppingCartItem({ shoppingCartItem }));
        })
      );
  }

  getUserCartItems(): Observable<ShoppingCartItem[]> {
    return this.apiService
      .get<ApiResponse<ShoppingCartItem[]>>('shoppingCart')
      .pipe(map((cartItemsDTO) => cartItemsDTO.data));
  }

  public getUserShoppingCartItems(): Observable<ShoppingCartItem[]> {
    const ownerId = this.cookieService.getCookie('userId');
    return this.apiService
      .get<ApiResponse<ShoppingCartItem[]>>(
        'shoppingCart/getCurrentUserItems',
        {
          ownerId
        }
      )
      .pipe(map((items) => items.data));
  }

  // public addReadyProductToShoppingCart(product: Product): void {
  //   // const item = this.createReadyProductForShoppingCart(product);
  //   // this.addItemToShoppingCart(item);
  // }

  // private createReadyProductForShoppingCart(product: Product): void {
  //   const userId = this.cookieService.getCookie('userId');
  //   // const item: ShoppingCartItem = {
  //   //   ownerId: userId,
  //   //   name: product.name,
  //   //   comment: product.details.comment,
  //   //   details: {
  //   //     baseProduct: product.baseProduct,
  //   //     isExtraNameEmbroidery: product.details.nameEmbroideryCheckbox,
  //   //     nameEmbroideryText: product.details.nameEmbroideryInput
  //   //   },
  //   //   price: product.price
  //   // };
  //   // return item;
  // }

  // public addBuiltProductToShoppingCart(product: BuiltProduct): void {
  //   const item = this.createBuiltProductForShoppingCart(product);
  //   this.addItemToShoppingCart(item);
  // }

  // private createBuiltProductForShoppingCart(
  //   product: BuiltProduct
  // ): ShoppingCartItem {
  //   const userId = this.cookieService.getCookie('userId');
  //   const item: ShoppingCartItem = {
  //     ownerId: userId,
  //     name: product.baseMaterials.baseProduct,
  //     comment: product.extraOptions.productComment,
  //     details: {
  //       baseProduct: product.baseMaterials.baseProduct,
  //       baseColor: product.baseMaterials.baseColor,
  //       szundikendoColor: product.baseMaterials.szundikendoColor,
  //       minkyColorBack: product.baseMaterials.minkyColorBack,
  //       earsColor: product.baseMaterials.earsColor,
  //       earsAndBodyColor: product.baseMaterials.earsAndBodyColor,
  //       noseColor: product.baseMaterials.noseColor,
  //       ribbonColor: product.baseMaterials.ribbonColor,
  //       isExtraMinkyEars: product.extraOptions.extraMinkyEarsCheckbox,
  //       minkyEarsColor: product.extraOptions.extraMinkyEarsInput,
  //       isExtraNameEmbroidery: product.extraOptions.nameEmbroideryCheckbox,
  //       nameEmbroideryText: product.extraOptions.nameEmbroideryInput
  //     },
  //     price: product.price
  //   };
  //   return item;
  // }

  // private addItemToShoppingCart(item: ShoppingCartItem): void {
  //   this.apiService
  //     .post<ShoppingCartItemDTO>('shoppingCart', item)
  //     .pipe(
  //       tap((productDTO) => {
  //         const shoppingCartItem: ShoppingCartItem = productDTO.data.item;
  //         this.store$.dispatch(addShoppingCartItem({ shoppingCartItem }));
  //         const productName = item.name;
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'Siker!',
  //           detail: `${productName + ` hozzáadva, ${item.price} Ft értékben.`}`
  //         });
  //       })
  //     )
  //     .subscribe();
  // }

  deleteItemFromCart(shoppingCartItem: ShoppingCartItem): Observable<null> {
    return this.apiService
      .delete<null>('shoppingCart', shoppingCartItem._id)
      .pipe(
        tap(() => {
          this.store$.dispatch(deleteShoppingCartItem({ shoppingCartItem }));
        })
      );
  }
}
