import { Injectable } from '@angular/core';

import { Observable, map } from 'rxjs';

import { ApiService } from './api.service';
import { ApiResponse } from '@core/models/api-response.model';
import { Order } from '@core/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private apiService: ApiService) {}

  getOrder(id: string): Observable<Order> {
    return this.apiService
      .get<ApiResponse<Order>>(`order/getOne/${id}`)
      .pipe(map((orderDTO) => orderDTO.data));
  }

  getOrders$(): Observable<Order[]> {
    return this.apiService
      .get<ApiResponse<Order[]>>('order/getAll')
      .pipe(map((ordersDTO) => ordersDTO.data));
  }

  getCheckoutSession(shippingMethod: any) {
    return this.apiService.post('order/addOrder', shippingMethod);
  }
}
