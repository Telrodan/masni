import { Injectable } from '@angular/core';

import { ApiService } from './api.service';
import { ApiResponse } from '@core/models/api-response.model';
import { Order } from '@core/models/order.model';
import { Observable, map } from 'rxjs';
// import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // public orders: Order[];

  constructor(private apiService: ApiService) {}

  getCheckoutSession(shippingMethod: any) {
    return this.apiService.post('order/addOrder', shippingMethod);
  }

  getOrder(id: string): Observable<Order> {
    return this.apiService
      .get<ApiResponse<Order>>(`order/getOne/${id}`)
      .pipe(map((orderDTO) => orderDTO.data));
  }

  getOrders(): Observable<Order[]> {
    return this.apiService
      .get<ApiResponse<Order[]>>('order/all')
      .pipe(map((ordersDTO) => ordersDTO.data));
  }
}
