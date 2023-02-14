import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { Order } from '../models/order.model';
import { ApiService } from './api.service';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(
    private apiService: ApiService,
    private cookieService: CookieService
  ) {}

  public addOrderToCart(
    orderForm: FormGroup,
    price: number
  ): Observable<Order> {
    const baseMaterials = orderForm.value['baseMaterials'];
    const extraOptions = orderForm.value['extraOptions'];
    const order: Order = {
      productName: baseMaterials.baseProduct,
      productDetails: {
        baseProduct: baseMaterials.baseProduct,
        baseColor: baseMaterials.baseColor,
        szundikendoColor: baseMaterials?.szundikendoColor,
        earsColor: baseMaterials?.ears,
        ribbonColor: baseMaterials?.ribbon,
        isExtraMinkyEars: extraOptions?.extraMinkyEarCheckbox,
        minkyEarsColor: extraOptions?.extraMinkyEarInput,
        isExtraNameEmbroidery: extraOptions?.nameEmbroideryCheckbox,
        nameEmbroideryText: extraOptions?.nameEmbroideryInput
      },
      orderComment: extraOptions.orderComment,
      buyerId: this.cookieService.getCookie('userId'),
      price: price
    };
    return this.apiService.post$('orders', order);
  }

  public getPersonalOrders(): Observable<{
    status: string;
    data: { orders: Order[] };
  }> {
    const userId = this.cookieService.getCookie('userId');
    return this.apiService.get$<{ status: string; data: { orders: Order[] } }>(
      'orders',
      { id: userId }
    );
  }
}
