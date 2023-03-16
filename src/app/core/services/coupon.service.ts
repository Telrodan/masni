import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, Observable, tap } from 'rxjs';
import { AppState } from 'src/app/reducer';
import { Coupon } from '../models/coupon.model';
import { ApiService } from './api.service';
import { CookieService } from './cookie.service';

interface CouponDataType {
  data: {
    coupon: Coupon;
  };
}

interface CouponsDataType {
  data: {
    coupons: Coupon[];
  };
}

interface CouponsBackendInterface {
  data: {
    coupons: Coupon[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private store$: Store
  ) {}

  // COUPON TYPES
  // sett = buy 1 nyuszko/macko es nuszko szundikendo/macko szundikendo es 1000 Ft kedvezmeny

  public activateCoupon(couponType: string): Observable<Coupon> {
    const coupon = {
      couponOwner: this.cookieService.getCookie('userId'),
      couponType
    };
    return this.apiService.post<CouponDataType>('coupon/activate', coupon).pipe(
      map((result) => {
        const coupon = result.data.coupon;
        return coupon;
      })
    );
  }

  public setUserCouponsStore(): Observable<Coupon[]> {
    const owner = {
      couponOwner: this.cookieService.getCookie('userId')
    };
    return this.apiService.get<CouponsDataType>('coupon/get', owner).pipe(
      map((result) => {
        const coupons = result.data.coupons;
        return coupons;
      }),
      filter((coupons) => !!coupons),
      tap((coupons) => {
        // this.store$.dispatch(setCoupons({ coupons }));
      })
    );
  }
}
