import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Coupon } from 'src/app/core/models/coupon.mode';
import { AuthService } from 'src/app/core/services/auth.service';
import { CouponService } from 'src/app/core/services/coupon.service';

@Component({
  selector: 'masni-handmade-dolls-setts',
  templateUrl: './setts.component.html',
  styleUrls: ['./setts.component.scss']
})
export class SettsComponent implements OnInit {
  public isAuthenticated = false;
  public coupon: Coupon;

  constructor(
    private couponService: CouponService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  public ngOnInit(): void {
    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.couponService.getCouponById().subscribe((response) => {
      this.coupon = response.coupon;
    });
  }

  public onActivateCoupon(): void {
    this.couponService.activateCoupon().subscribe((response) => {
      this.coupon = response.coupon;
      this.messageService.add({
        severity: 'success',
        summary: 'Aktiválva',
        detail: 'Szett kedvezmény aktív'
      });
    });
  }
}
