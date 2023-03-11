import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';
import { MessageService } from 'primeng/api';

import { MaterialService } from './material.service';
import { CookieService } from './cookie.service';
import { ApiService } from './api.service';
import { Order } from '../models/order.model';

interface OrdersDataBackendInterface {
  data: {
    orders: Order[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  public orders: Order[];

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private materialService: MaterialService,
    private messageService: MessageService,
    private store$: Store
  ) {}

  public addOrderToCart(orderForm: FormGroup, price: number): void {
    const baseMaterials = orderForm.value['baseMaterials'];
    const extraOptions = orderForm.value['extraOptions'];
    const order: Order = {
      productName: baseMaterials.baseProduct,
      productDetails: {
        baseProduct: baseMaterials.baseProduct,
        baseColor: baseMaterials.baseColor,
        szundikendoColor: baseMaterials?.szundikendoColor,
        minkyColorBack: baseMaterials?.minkyColorBack,
        earsColor: baseMaterials?.earsColor,
        ribbonColor: baseMaterials?.ribbonColor,
        isExtraMinkyEars: extraOptions?.extraMinkyEarCheckbox,
        minkyEarsColor: extraOptions?.extraMinkyEarInput,
        isExtraNameEmbroidery: extraOptions?.nameEmbroideryCheckbox,
        nameEmbroideryText: extraOptions?.nameEmbroideryInput
      },
      orderComment: extraOptions.orderComment,
      buyerId: this.cookieService.getCookie('userId'),
      price: price
    };

    // this.store$.dispatch(addOrder({ order }));
    this.apiService
      .post('orders', order)
      .pipe(
        tap(() => {
          const productName =
            order.productDetails.baseProduct.charAt(0).toUpperCase() +
            order.productDetails.baseProduct.slice(1);
          this.messageService.add({
            severity: 'success',
            summary: 'Siker!',
            detail: `${productName + ` hozzáadva, ${order.price} Ft értékben.`}`
          });
        })
      )
      .subscribe();
  }

  // public setUserOrdersStore(): void {
  //   const user = {
  //     buyerId: this.cookieService.getCookie('userId')
  //   };
  //   this.apiService
  //     .get<OrdersDataBackendInterface>('orders', user)
  //     .pipe(
  //       map((ordersDTO) => {
  //         const ordersWithId = ordersDTO.data.orders.map((rawOrder: any) => {
  //           return Order.fromDTO(rawOrder);
  //         });
  //         const orders = this.createReadableOrders(ordersWithId);
  //         return orders;
  //       }),
  //       tap((orders) => {
  //         this.store$.dispatch(coreActions.setOrders({ orders }));
  //       })
  //     )
  //     .subscribe();
  // }

  // private createReadableOrders(orders: Order[]): Order[] {
  //   orders.map((order) => {
  //     for (const key in order) {
  //       order[key] = this.materialService.getMaterialNameById(order[key]);
  //     }
  //     const productDetails = order.productDetails[0];
  //     for (const key in productDetails) {
  //       productDetails[key] = this.materialService.getMaterialNameById(
  //         productDetails[key]
  //       );
  //     }
  //   });
  //   return orders;
  // }

  // public deleteOrder(id: string): Observable<null> {
  //   return this.apiService.delete('orders', id);
  // }
}
