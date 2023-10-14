import { Component, OnInit } from '@angular/core';
import { Log } from '@core/models/log.model';
import { TrackingData } from '@core/models/tracking-data.model';
import { LogService } from '@core/services/log.service';
import { TrackService } from '@core/services/track.service';
import { selectAllOrders, selectUsers } from '@core/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, filter, map, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'mhd-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  usersCount$: Observable<number>;
  ordersCount$: Observable<number>;
  trackingData$: Observable<TrackingData>;
  logs$: Observable<Log[]>;
  totalSales = 0;

  constructor(
    private trackService: TrackService,
    private store: Store,
    private logService: LogService
  ) {}

  ngOnInit(): void {
    this.usersCount$ = this.store.select(selectUsers).pipe(
      filter((users) => !!users.length),
      map((users) => users.length),
      untilDestroyed(this)
    );

    this.ordersCount$ = this.store.select(selectAllOrders).pipe(
      filter((orders) => !!orders.length),
      tap((orders) => {
        this.totalSales = 0;

        orders.forEach((order) => {
          if (order.status === 'paid') {
            this.totalSales += order.price;
          }
        });
      }),
      map((orders) => orders.length)
    );

    this.logs$ = this.logService
      .getLogs()
      .pipe(
        map((logs) =>
          logs.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
        )
      );

    this.trackingData$ = this.trackService.getTrackingData$().pipe();
  }
}
