import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { Observable, filter, map } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Table } from 'primeng/table';

import { selectAllOrders } from '@core/store';
import { Order } from '@core/models/order.model';
import { OrderDetailsComponent } from './components/order-details/order-details.component';

@UntilDestroy()
@Component({
  selector: 'mhd-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  @ViewChild('table') ordersTable: Table;

  orders$: Observable<Order[]>;

  constructor(private store$: Store, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.orders$ = this.store$.select(selectAllOrders).pipe(
      filter((orders) => !!orders),
      map((orders) => [...orders]),
      untilDestroyed(this)
    );
  }

  onOrderDetails(order: Order): void {
    this.dialog.open(OrderDetailsComponent, {
      minWidth: '40vw',
      data: order
    });
  }

  applyFilterGlobal($event: any, stringVal: string, table: Table): void {
    const filter = ($event.target as HTMLInputElement).value;

    table.filterGlobal(filter, stringVal);
  }
}
