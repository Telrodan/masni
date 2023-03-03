import { Component, OnDestroy, OnInit } from '@angular/core';

import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { filter, map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import coreSelectors from 'src/app/core/core-ngrx/selectors';
import { Coupon } from 'src/app/core/models/coupon.mode';

import { Order } from 'src/app/core/models/order.model';
import { CouponService } from 'src/app/core/services/coupon.service';
import { MaterialService } from 'src/app/core/services/material.service';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: 'masni-handmade-dolls-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  public orders: Order[];
  public coupons: Coupon[];
  public cartPrice = 0;
  private destroy = new Subject();
  public faCreditCard = faCreditCard;

  constructor(
    private orderService: OrderService,
    private messageService: MessageService,
    private couponService: CouponService,
    private store$: Store
  ) {}

  public ngOnInit(): void {
    this.couponService
      .getUserCoupons()
      .pipe(
        tap((coupons) => {
          this.coupons = coupons;
          console.log(this.coupons);
        })
      )
      .subscribe();

    this.store$
      .select(coreSelectors.selectMaterials)
      .pipe(
        filter((materials) => !!materials.length),
        switchMap(() => this.orderService.getPersonalOrders()),
        map((orders) => {
          orders.map((order) => {
            this.cartPrice += order.price;
          });
          return orders;
        }),
        tap((orders) => {
          this.orders = orders;
        }),
        takeUntil(this.destroy)
      )
      .subscribe();
  }

  public onDeleteOrder(id: string): void {
    this.orderService
      .deleteOrder(id)
      .pipe(
        tap(() => {
          const index = this.orders.findIndex((order) => order.id === id);
          this.cartPrice -= this.orders[index].price;
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

  public details(order: Order) {
    console.log(order);
  }

  public ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
    this.cartPrice = 0;
  }
}
