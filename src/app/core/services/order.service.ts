import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { map, Observable, tap } from 'rxjs';
import { Order } from '../models/order.model';
import { ApiService } from './api.service';
import { CookieService } from './cookie.service';
import { MaterialService } from './material.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private materialService: MaterialService,
    private messageService: MessageService
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
    this.apiService.post$('orders', order).subscribe(() => {
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

  public getPersonalOrders(): Observable<{ orders: Order[] }> {
    const owner = {
      buyerId: this.cookieService.getCookie('userId')
    };
    return this.apiService.get$<{ orders: Order[] }>('orders', owner).pipe(
      map((ordersDTO) => {
        console.log(ordersDTO);
        return ordersDTO;
      })
    );
  }
}
