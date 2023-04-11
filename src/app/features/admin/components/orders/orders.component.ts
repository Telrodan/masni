import { Component, OnInit } from '@angular/core';
import { Order } from '@core/models/order.model';
import { OrderService } from '@core/services/order.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'masni-handmade-dolls-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders$: Observable<Order[]>;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orders$ = this.orderService.getOrders();
  }
}
