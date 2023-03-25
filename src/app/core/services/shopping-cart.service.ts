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
import { BuiltProduct, Product } from '@core/models/product.model';
import { formatNameInput } from 'src/app/shared/util/input-formatter';

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
      .get<ShoppingCartItemsDTO>('shoppingCart/getCurrentUserItems', {
        ownerId
      })
      .pipe(map((items) => items.data.items));
  }

  public addReadyProductToShoppingCart(product: Product): void {
    // const item = this.createReadyProductForShoppingCart(product);
    // this.addItemToShoppingCart(item);
  }

  private createReadyProductForShoppingCart(product: Product): void {
    const userId = this.cookieService.getCookie('userId');
    // const item: ShoppingCartItem = {
    //   ownerId: userId,
    //   name: product.name,
    //   comment: product.details.comment,
    //   details: {
    //     baseProduct: product.baseProduct,
    //     isExtraNameEmbroidery: product.details.nameEmbroideryCheckbox,
    //     nameEmbroideryText: product.details.nameEmbroideryInput
    //   },
    //   price: product.price
    // };
    // return item;
  }

  public addBuiltProductToShoppingCart(product: BuiltProduct): void {
    const item = this.createBuiltProductForShoppingCart(product);
    this.addItemToShoppingCart(item);
  }

  private createBuiltProductForShoppingCart(
    product: BuiltProduct
  ): ShoppingCartItem {
    const userId = this.cookieService.getCookie('userId');
    const item: ShoppingCartItem = {
      ownerId: userId,
      name: product.baseMaterials.baseProduct,
      comment: product.extraOptions.productComment,
      details: {
        baseProduct: product.baseMaterials.baseProduct,
        baseColor: product.baseMaterials.baseColor,
        szundikendoColor: product.baseMaterials.szundikendoColor,
        minkyColorBack: product.baseMaterials.minkyColorBack,
        earsColor: product.baseMaterials.earsColor,
        earsAndBodyColor: product.baseMaterials.earsAndBodyColor,
        noseColor: product.baseMaterials.noseColor,
        ribbonColor: product.baseMaterials.ribbonColor,
        isExtraMinkyEars: product.extraOptions.extraMinkyEarsCheckbox,
        minkyEarsColor: product.extraOptions.extraMinkyEarsInput,
        isExtraNameEmbroidery: product.extraOptions.nameEmbroideryCheckbox,
        nameEmbroideryText: product.extraOptions.nameEmbroideryInput
      },
      price: product.price
    };
    return item;
  }

  private addItemToShoppingCart(item: ShoppingCartItem): void {
    this.apiService
      .post<ShoppingCartItemDTO>('shoppingCart', item)
      .pipe(
        tap((productDTO) => {
          const shoppingCartItem: ShoppingCartItem = productDTO.data.item;
          this.store$.dispatch(addShoppingCartItem({ shoppingCartItem }));
          const productName = formatNameInput(item.name);
          this.messageService.add({
            severity: 'success',
            summary: 'Siker!',
            detail: `${productName + ` hozzáadva, ${item.price} Ft értékben.`}`
          });
        })
      )
      .subscribe();
  }

  public deleteProductFromCart(shoppingCartItem: ShoppingCartItem): void {
    this.apiService
      .delete('shoppingCart', shoppingCartItem._id)
      .pipe(
        tap(() => {
          const productName =
            shoppingCartItem.name.charAt(0).toUpperCase() +
            shoppingCartItem.name.slice(1);

          this.messageService.add({
            severity: 'success',
            summary: 'Siker!',
            detail: `${
              productName +
              ` termék törölve, ${shoppingCartItem.price} Ft értékben.`
            }`
          });

          this.store$.dispatch(deleteShoppingCartItem({ shoppingCartItem }));
        })
      )
      .subscribe();
  }
}
