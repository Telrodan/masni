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
import {
  ShoppingCartItem,
  ShoppingCartItemDTO,
  ShoppingCartItemsDTO
} from '@core/models/shopping-cart.model';
import { BuiltProduct } from '@core/models/product.model';

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
      .get<ShoppingCartItemsDTO>('shopping-cart/get-user-items', { ownerId })
      .pipe(map((items) => items.data.shoppingCartItems));
  }

  public addBuiltProductToCart(rawProduct: BuiltProduct): void {
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
        earsAndBodyColor: rawProduct.baseMaterials.earsAndBodyColor,
        noseColor: rawProduct.baseMaterials.noseColor,
        ribbonColor: rawProduct.baseMaterials.ribbonColor,
        isExtraMinkyEars: rawProduct.extraOptions.extraMinkyEarsCheckbox,
        minkyEarsColor: rawProduct.extraOptions.extraMinkyEarsInput,
        isExtraNameEmbroidery: rawProduct.extraOptions.nameEmbroideryCheckbox,
        nameEmbroideryText: rawProduct.extraOptions.nameEmbroideryInput
      },
      productPrice: rawProduct.price
    };

    this.apiService
      .post<ShoppingCartItemDTO>('shopping-cart/add', product)
      .pipe(
        tap((productDTO) => {
          const shoppingCartItem: ShoppingCartItem =
            productDTO.data.shoppingCartItem;
          this.store$.dispatch(addShoppingCartItem({ shoppingCartItem }));

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

  public deleteProductFromCart(shoppingCartItem: ShoppingCartItem): void {
    this.apiService
      .delete('shopping-cart', shoppingCartItem._id)
      .pipe(
        tap(() => {
          const productName =
            shoppingCartItem.productName.charAt(0).toUpperCase() +
            shoppingCartItem.productName.slice(1);

          this.messageService.add({
            severity: 'success',
            summary: 'Siker!',
            detail: `${
              productName +
              ` termék törölve, ${shoppingCartItem.productPrice} Ft értékben.`
            }`
          });

          this.store$.dispatch(deleteShoppingCartItem({ shoppingCartItem }));
        })
      )
      .subscribe();
  }
}
