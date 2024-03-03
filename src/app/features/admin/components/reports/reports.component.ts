import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { UntilDestroy } from '@ngneat/until-destroy';
import { Observable, combineLatest, map } from 'rxjs';

import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { UserService } from '@core/services/user.service';
import { OrderService } from '@core/services/order.service';
import { TrackService } from '@core/services/track.service';
import { ReportsData } from './reports-data.model';

@UntilDestroy()
@Component({
  selector: 'nyk-reports',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ReportsComponent implements OnInit {
  @HostBinding('class.nyk-reports') hostClass = true;

  reportsData$: Observable<ReportsData>;

  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private trackService: TrackService
  ) {}

  ngOnInit(): void {
    this.reportsData$ = combineLatest([
      this.userService.getUsers$(),
      this.orderService.getOrders$(),
      this.trackService.getTrackingData$()
    ]).pipe(
      map(([users, orders, trackingData]) => ({
        usersCount: users.length,
        ordersCount: orders.filter((order) => order.status === 'paid').length,
        totalSales: orders
          .filter((order) => order.status === 'paid')
          .reduce((acc, curr) => acc + curr.price, 0),
        trackingData
      }))
    );
  }
}
