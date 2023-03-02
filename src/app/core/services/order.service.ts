import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Order } from '../models/order.model';
import { ApiService } from './api.service';
import { CookieService } from './cookie.service';
import { MaterialService } from './material.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  public orders: Order[];
  private orderCounter = 0;
  private orderCounterUpdatedListener = new BehaviorSubject<number>(
    this.orderCounter
  );

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private materialService: MaterialService,
    private messageService: MessageService
  ) {}

  public getOrderCounterListener$(): Observable<number> {
    return this.orderCounterUpdatedListener.asObservable();
  }

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
    this.apiService.post('orders', order).subscribe(() => {
      const productName = this.materialService.getMaterialNameById(
        order.productDetails.baseProduct
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Siker!',
        detail: `${productName + ` hozzáadva, ${order.price} Ft értékben.`}`
      });
    });
  }

  public getPersonalOrders(): Observable<Order[]> {
    const owner = {
      buyerId: this.cookieService.getCookie('userId')
    };
    return this.apiService.get<{ orders: Order[] }>('orders', owner).pipe(
      map((ordersDTO) => {
        const orders = ordersDTO.orders.map((rawOrder: any) => {
          return Order.fromDTO(rawOrder);
        });
        orders.map((order) => {
          for (const key in order) {
            order[key] = this.materialService.getMaterialNameById(order[key]);
          }
          const productDetails = order.productDetails[0];
          for (const key in productDetails) {
            productDetails[key] = this.materialService.getMaterialNameById(
              productDetails[key]
            );
          }
        });
        return orders;
      }),
      tap((orders) => {
        this.orders = orders;
        this.orderCounter = this.orders.length;
        this.orderCounterUpdatedListener.next(this.orderCounter);
      })
    );
  }

  public deleteOrder(id: string): Observable<null> {
    return this.apiService.delete('orders', id);
  }
}
