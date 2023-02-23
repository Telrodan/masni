import { Component, OnDestroy, OnInit } from '@angular/core';

import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { Order } from 'src/app/core/models/order.model';
import { OrderService } from 'src/app/core/services/order.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';

@Component({
  selector: 'masni-handmade-dolls-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  public orders: Order[];
  public faCreditCard = faCreditCard;
  private destroy = new Subject();

  constructor(private orderService: OrderService) {}

  public ngOnInit(): void {
    this.orderService
      .getPersonalOrders()
      .pipe(takeUntil(this.destroy))
      .subscribe((response) => {
        this.orders = response.orders;
      });
  }

  public ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
