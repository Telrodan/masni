import { Injectable } from '@angular/core';

import { ApiService } from './api.service';
// import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // public orders: Order[];

  constructor(private apiService: ApiService) {}

  getCheckoutSession(shippingMethod) {
    return this.apiService.post('order/addOrder', shippingMethod);
  }
}
