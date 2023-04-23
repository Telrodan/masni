import { Component, OnInit } from '@angular/core';
import { Log } from '@core/models/log.model';
import { TrackData } from '@core/models/track.model';
import { LogService } from '@core/services/log.service';
import { TrackService } from '@core/services/track.service';
import { selectOrders, selectUsers } from '@core/store';
import { Store } from '@ngrx/store';
import { Observable, filter, map } from 'rxjs';

interface TrackingData {
  thisMonthVisitors: number;
  allVisitors: number;
}

@Component({
  selector: 'masni-handmade-dolls-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  usersCount$: Observable<number>;
  ordersCount$: Observable<number>;
  trackingData$: Observable<TrackingData>;
  logs$: Observable<Log[]>;

  constructor(
    private trackService: TrackService,
    private store: Store,
    private logService: LogService
  ) {}

  ngOnInit(): void {
    this.usersCount$ = this.store.select(selectUsers).pipe(
      filter((users) => !!users.length),
      map((users) => users.length)
    );

    this.ordersCount$ = this.store.select(selectOrders).pipe(
      filter((orders) => !!orders.length),
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

    this.trackingData$ = this.trackService.getTrackingData().pipe(
      map((trackingData) => {
        const thisMonthVisitors: TrackData[] = [];
        const currentDate = new Date();
        const oneMonthInMilliseconds = 30 * 24 * 60 * 60 * 1000;
        trackingData.forEach((data) => {
          const itemCreated = new Date(data.createdAt);
          const timeDifference = currentDate.getTime() - itemCreated.getTime();
          if (timeDifference < oneMonthInMilliseconds) {
            thisMonthVisitors.push(data);
          }
        });
        return {
          thisMonthVisitors: thisMonthVisitors.length,
          allVisitors: trackingData.length
        };
      })
    );
  }
}
