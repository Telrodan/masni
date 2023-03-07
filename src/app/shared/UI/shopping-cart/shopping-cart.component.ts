import { Component, OnDestroy, OnInit } from '@angular/core';

import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { filter, map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import coreSelectors from 'src/app/core/core-ngrx/selectors';
import { Coupon } from 'src/app/core/models/coupon.mode';

import { Order } from 'src/app/core/models/order.model';
import { CouponService } from 'src/app/core/services/coupon.service';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: 'masni-handmade-dolls-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  public orders: Order[];
  public coupons: Coupon[];
  public discountedCartPrice = 0;
  public originalCartPrice = 0;
  public discount = 0;
  private destroy = new Subject();
  private nyuszkoSett = ['nyuszkó', 'nyuszkó-szundikendő'];
  private mackoSett = ['mackó', 'mackó-szundikendő'];
  public faCreditCard = faCreditCard;

  constructor(
    private orderService: OrderService,
    private messageService: MessageService,
    private couponService: CouponService,
    private store$: Store
  ) {}

  public ngOnInit(): void {
    this.store$
      .select(coreSelectors.selectMaterials)
      .pipe(
        filter((materials) => !!materials.length),
        switchMap(() => this.store$.select(coreSelectors.selectOrders)),
        map((orders) => {
          console.log(orders);
          orders.map((order) => {
            this.discountedCartPrice += order.price;
          });
          this.originalCartPrice = this.discountedCartPrice;
          return orders;
        }),
        tap((orders) => {
          this.orders = orders;
        }),
        switchMap(() => this.couponService.getUserCoupons()),
        tap((coupons) => {
          if (!coupons) return;
          this.coupons = coupons;
          if (this.checkSettCouponConditions()) {
            this.discount = this.coupons[0].discount;
            this.discountedCartPrice -= this.discount;
          }
        }),
        takeUntil(this.destroy)
      )
      .subscribe();
  }

  private checkSettCouponConditions(): boolean {
    this.discount = 0;
    let isValid = false;
    let nyuszkoSettCounter = 0;
    let mackoSettCounter = 0;
    this.orders.forEach((order) => {
      if (this.nyuszkoSett.includes(order.productName)) nyuszkoSettCounter++;
      if (this.mackoSett.includes(order.productName)) mackoSettCounter++;
    });
    if (nyuszkoSettCounter >= 2) isValid = true;
    if (mackoSettCounter >= 2) isValid = true;
    return isValid;
  }

  public onDeleteOrder(id: string): void {
    this.orderService
      .deleteOrder(id)
      .pipe(
        tap(() => {
          const index = this.orders.findIndex((order) => order.id === id);
          this.discountedCartPrice -= this.orders[index].price;
          this.originalCartPrice -= this.orders[index].price;
          this.orders.splice(index, 1);
          if (!this.checkSettCouponConditions()) {
            this.discountedCartPrice = this.originalCartPrice;
          }
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
    this.discountedCartPrice = 0;
  }
}
