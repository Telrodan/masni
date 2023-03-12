import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject, takeUntil, tap } from 'rxjs';
import { MessageService } from 'primeng/api';

import { Coupon } from '@core/models/coupon.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CouponService } from 'src/app/core/services/coupon.service';

@Component({
  selector: 'masni-handmade-dolls-setts',
  templateUrl: './setts.component.html',
  styleUrls: ['./setts.component.scss']
})
export class SettsComponent implements OnInit, OnDestroy {
  public isAuthenticated = false;
  public coupon: Coupon;
  private destroy = new Subject<void>();

  constructor(
    private couponService: CouponService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  public ngOnInit(): void {
    this.authService
      .getAuthStatus$()
      .pipe(takeUntil(this.destroy))
      .subscribe((response) => {
        this.isAuthenticated = response;
      });

    this.couponService
      .setUserCouponsStore()
      .pipe(
        tap((coupons) => {
          this.coupon = coupons.find((coupon) => coupon.couponType === 'sett');
        })
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  public onActivateCoupon(): void {
    this.couponService
      .activateCoupon('sett')
      .pipe(
        tap((coupon) => {
          this.coupon = coupon;
          this.messageService.add({
            severity: 'success',
            summary: 'Siker!',
            detail: 'Szett akció aktív'
          });
        })
      )
      .subscribe();
  }
}
