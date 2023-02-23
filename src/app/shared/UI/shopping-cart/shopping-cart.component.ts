import { Component, OnDestroy, OnInit } from '@angular/core';

import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { map, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { Order } from 'src/app/core/models/order.model';
import { MaterialService } from 'src/app/core/services/material.service';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: 'masni-handmade-dolls-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  public orders: Order[];
  public faCreditCard = faCreditCard;
  public cartPrice = 0;
  private destroy = new Subject();

  constructor(
    private orderService: OrderService,
    private materialService: MaterialService,
    private messageService: MessageService
  ) {}

  public ngOnInit(): void {
    this.materialService
      .getMaterials$()
      .pipe(
        switchMap(() => this.orderService.getPersonalOrders()),
        map((orders) => {
          orders.map((order) => {
            this.cartPrice += order.price;
          });
          return orders;
        }),
        takeUntil(this.destroy)
      )
      .subscribe((orders) => {
        this.orders = orders;
      });
  }

  public onDeleteOrder(id: string): void {
    this.orderService
      .deleteOrder(id)
      .pipe(
        tap(() => {
          const index = this.orders.findIndex((order) => order.id === id);
          this.orders.splice(index, 1);
        }),
        takeUntil(this.destroy)
      )
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Termék törölve!'
        });
      });
  }

  public ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
    this.cartPrice = 0;
  }
}
