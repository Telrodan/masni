import { Component, OnInit } from '@angular/core';
import { getMaterials } from '@core/store';
import { getShoppingCartItems } from '@core/store/actions/shopping-cart.actions';

import { Store } from '@ngrx/store';
import { Carousel } from 'primeng/carousel';
import { filter, of, switchMap, tap } from 'rxjs';

import { AuthService } from './core/services/auth.service';
import { CouponService } from './core/services/coupon.service';
import { MaterialService } from './core/services/material.service';
import { ShoppingCartService } from './core/services/shopping-cart.service';

@Component({
  selector: 'masni-handmade-dolls-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private materialService: MaterialService,
    private shoppingCartService: ShoppingCartService,
    private couponService: CouponService,
    private store$: Store
  ) {
    // Allows user to scroll on carousel(mobile scroll issue fix)
    Carousel.prototype.onTouchMove = () => {};
  }

  public ngOnInit(): void {
    this.store$.dispatch(getMaterials());
    this.authService
      .getAuthStatus$()
      .pipe(
        filter((isAuth) => !!isAuth),
        tap(() => {
          console.log('minden fasza');
          this.store$.dispatch(getShoppingCartItems());
        })
      )
      .subscribe();

    // APP_INIT
    // of()
    //   .pipe(
    //     // switchMap(() => this.materialService.setMaterialsStore()),
    //     filter(() => this.authService.getIsAuthenticated()),
    //     switchMap(() => this.couponService.setUserCouponsStore()),
    //     switchMap(() =>
    //       this.shoppingCartService.setUserShoppingCartProductsStore()
    //     )
    //   )
    //   .subscribe();
  }
}
