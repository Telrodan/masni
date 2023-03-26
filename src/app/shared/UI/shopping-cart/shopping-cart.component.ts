import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import {
  MessageService,
  ConfirmationService,
  ConfirmEventType
} from 'primeng/api';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';

import { ShoppingCartItem } from '@core/models/shopping-cart-item.model';
import { shoppingCartItemsSelector } from '@core/store/selectors/shopping-cart.selectors';

import { filter, map, Observable, tap, first } from 'rxjs';

// import coreSelectors from 'src/app/core/store/selectors';
import { Coupon } from '@core/models/coupon.model';
import { CouponService } from 'src/app/core/services/coupon.service';
import { OrderService } from 'src/app/core/services/order.service';
import { ShoppingCartService } from 'src/app/core/services/shopping-cart.service';
import { environment } from 'src/environments/environment';

interface ShoppingCartData {
  items: ShoppingCartItem[];
  price: number;
}

@Component({
  selector: 'masni-handmade-dolls-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  shoppingCartData$: Observable<ShoppingCartData>;
  productImagesUrl = environment.productImagesUrl;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private orderService: OrderService,
    private messageService: MessageService,
    private couponService: CouponService,
    private store$: Store,
    private confirmationService: ConfirmationService
  ) {}

  public ngOnInit(): void {
    this.shoppingCartData$ = this.store$.select(shoppingCartItemsSelector).pipe(
      filter((items) => !!items),
      map((items) => {
        let price = 0;
        items.map((item) => {
          price += item.price;
        });

        return {
          items,
          price
        };
      })
    );

    // this.store$
    //   .select(coreSelectors.selectUserCoupons)
    //   .pipe(
    //     filter((coupons) => coupons.length > 0),
    //     tap((coupons) => {
    //       this.coupons = coupons;
    //       this.discount = this.coupons[0].discount;
    //     })
    //   )
    //   .subscribe();
    // }

    // private checkSettCouponConditions(): boolean {
    //   this.discount = 0;
    //   let isValid = false;
    //   let nyuszkoSettCounter = 0;
    //   let mackoSettCounter = 0;
    //   this.orders.forEach((order) => {
    //     if (this.nyuszkoSett.includes(order.productName)) nyuszkoSettCounter++;
    //     if (this.mackoSett.includes(order.productName)) mackoSettCounter++;
    //   });
    //   if (nyuszkoSettCounter >= 2) isValid = true;
    //   if (mackoSettCounter >= 2) isValid = true;
    //   return isValid;
    // }
  }

  onDeleteOrder(item: ShoppingCartItem): void {
    const productName =
      item.product['name'].charAt(0).toUpperCase() +
      item.product['name'].slice(1);

    this.confirmationService.confirm({
      message: `Biztos törölni szeretnéd ${productName} terméket, ${item.price} Ft értékben?`,
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      accept: () => {
        this.shoppingCartService
          .deleteItemFromCart(item)
          .pipe(
            tap(() => {
              this.messageService.add({
                severity: 'success',
                summary: 'Siker!',
                detail: `${
                  productName + ` termék törölve, ${item.price} Ft értékben.`
                }`
              });
            })
          )
          .subscribe();
      }
    });
  }

  // this.orderService
  //   .deleteOrder(id)
  //   .pipe(
  //     tap(() => {
  //       const index = this.orders.findIndex((order) => order.id === id);
  //       this.discountedCartPrice -= this.orders[index].price;
  //       this.originalCartPrice -= this.orders[index].price;
  //       this.orders.splice(index, 1);
  //       if (!this.checkSettCouponConditions()) {
  //         this.discountedCartPrice = this.originalCartPrice;
  //       }
  //     }),
  //     takeUntil(this.destroy)
  //   )
  //   .subscribe(() => {
  //     this.messageService.add({
  //       severity: 'success',
  //       summary: 'Termék törölve!'
  //     });
  //   });
}
