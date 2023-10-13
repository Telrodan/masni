import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { getUsers } from '@core/store';
import { getOrders } from '@core/store/actions/order.actions';

@Component({
  selector: 'mhd-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(getOrders());
    this.store.dispatch(getUsers());
  }
}
