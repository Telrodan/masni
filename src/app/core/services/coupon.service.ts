import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, EMPTY, Observable } from 'rxjs';
import { Coupon } from '../models/coupon.mode';
import { ApiService } from './api.service';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private messageService: MessageService
  ) {}

  public activateCoupon(): Observable<{ coupon: Coupon }> {
    const coupon = {
      owner: this.cookieService.getCookie('userId')
    };
    return this.apiService.post$<{ coupon: Coupon }>('coupon/activate', coupon);
  }

  public getCouponById(): Observable<{ coupon: Coupon }> {
    const coupon = {
      owner: this.cookieService.getCookie('userId')
    };
    return this.apiService.post$<{ coupon: Coupon }>('coupon/get', coupon);
  }
}
