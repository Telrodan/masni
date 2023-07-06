import { Component, OnInit } from '@angular/core';
import { Order } from '@core/models/order.model';
import { OrderService } from '@core/services/order.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'masni-handmade-dolls-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders$: Observable<Order[]>;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orders$ = this.orderService.getOrders$();
  }
}
