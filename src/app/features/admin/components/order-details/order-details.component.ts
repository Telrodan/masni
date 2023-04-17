import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '@core/models/order.model';
import { OrderService } from '@core/services/order.service';
import { Observable, filter, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'masni-handmade-dolls-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  order$: Observable<Order>;
  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.order$ = this.route.params.pipe(
      filter((params) => !!params),
      map((params) => params['id']),
      switchMap((id) => this.orderService.getOrder(id)),
      map((order) => {
        order.user[0].phone = order.user[0].phone.replace(
          /^(\d{4})(\d{3})(\d{4})$/,
          '$1/$2-$3'
        );
        return order;
      })
    );
  }
}
