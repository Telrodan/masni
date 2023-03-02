import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Coupon } from '../models/coupon.mode';
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

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  constructor(
    private apiService: ApiService,
    private cookieService: CookieService
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
        const coupon = Coupon.fromDTO(result.data.coupon);
        return coupon;
      })
    );
  }

  public getUserCoupons(): Observable<Coupon[]> {
    const coupon = {
      couponOwner: this.cookieService.getCookie('userId')
    };
    return this.apiService.post<CouponsDataType>('coupon/get', coupon).pipe(
      map((result) => {
        const coupons = result.data.coupons;
        return coupons;
      })
    );
  }
}
