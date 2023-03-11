import { Component, OnInit } from '@angular/core';

import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { filter, map, Observable, tap, first } from 'rxjs';

// import coreSelectors from 'src/app/core/store/selectors';
import { Coupon } from 'src/app/core/models/coupon.mode';
import { ProductInterface } from 'src/app/core/models/product.model';
import { CouponService } from 'src/app/core/services/coupon.service';
import { OrderService } from 'src/app/core/services/order.service';
import { ShoppingCartService } from 'src/app/core/services/shopping-cart.service';

@Component({
  selector: 'masni-handmade-dolls-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  public products$: Observable<ProductInterface[]>;
  public coupons: Coupon[];
  public discount = 0;
  public totalPrice = 0;
  private nyuszkoSett = ['nyuszkó', 'nyuszkó-szundikendő'];
  private mackoSett = ['mackó', 'mackó-szundikendő'];
  public faCreditCard = faCreditCard;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private orderService: OrderService,
    private messageService: MessageService,
    private couponService: CouponService,
    private store$: Store
  ) {}

  public ngOnInit(): void {
    // this.products$ = this.store$
    //   .select(coreSelectors.selectUserShoppingCartProducts)
    //   .pipe(
    //     filter((products) => !!products),
    //     map((products) => {
    //       products.map((product) => {
    //         this.totalPrice += product.productPrice;
    //       });
    //       console.log(products);
    //       return products;
    //     })
    //   );
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
    // this.store$
    //   .select(coreSelectors.selectMaterials)
    //   .pipe(
    //     filter((materials) => !!materials.length),
    //     switchMap(() => this.store$.select(coreSelectors.selectOrders)),
    //     map((orders) => {
    //       console.log(orders);
    //       orders.map((order) => {
    //         this.discountedCartPrice += order.price;
    //       });
    //       this.originalCartPrice = this.discountedCartPrice;
    //       return orders;
    //     }),
    //     tap((orders) => {
    //       this.orders = orders;
    //     }),
    //     switchMap(() => this.couponService.getUserCoupons()),
    //     tap((coupons) => {
    //       if (!coupons) return;
    //       this.coupons = coupons;
    //       if (this.checkSettCouponConditions()) {
    //         this.discount = this.coupons[0].discount;
    //         this.discountedCartPrice -= this.discount;
    //       }
    //     }),
    //     takeUntil(this.destroy)
    //   )
    //   .subscribe();
  }

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

  public onDeleteOrder(product: ProductInterface): void {
    this.shoppingCartService.deleteProductFromCart(product);
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
}
