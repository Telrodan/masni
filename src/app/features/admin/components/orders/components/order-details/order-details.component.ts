import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Order } from '@core/models/order.model';

@Component({
  selector: 'mhd-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public order: Order) {}
}
