import { Component, OnInit } from '@angular/core';
import { Log } from '@core/models/log.model';
import { LogService } from '@core/services/log.service';
import { TrackService } from '@core/services/track.service';
import { selectAllOrders, selectUsers } from '@core/store';
import { Store } from '@ngrx/store';
import { Observable, filter, map, tap } from 'rxjs';

interface TrackingData {
  visitors: number;
  pageView: number;
  sameVisitors: number;
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
  totalSales = 0;

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

    this.trackingData$ = this.trackService.getTrackingData$().pipe(
      map((trackingData) => {
        let visitors = 0;
        let pageView = 0;
        let sameVisitors = 0;

        trackingData.forEach((tracking) => {
          if (tracking.visitor) {
            visitors++;
            pageView++;
          } else {
            pageView++;
          }
        });
        for (let i = 0; i < trackingData.length; i++) {
          if (trackingData[i].visitor) {
            const currentIp = trackingData[i].ip;
            for (let j = i + 1; j < trackingData.length; j++) {
              if (currentIp === trackingData[j].ip) {
                sameVisitors++;
                break;
              }
            }
          }
        }

        return {
          visitors,
          pageView,
          sameVisitors
        };
      })
      // map((trackingData) => {
      //   console.log(trackingData);
      //   const thisMonthVisitors: TrackData[] = [];
      //   const currentDate = new Date();
      //   const oneMonthInMilliseconds = 30 * 24 * 60 * 60 * 1000;
      //   trackingData.forEach((data) => {
      //     const itemCreated = new Date(data.createdAt);
      //     const timeDifference = currentDate.getTime() - itemCreated.getTime();
      //     if (timeDifference < oneMonthInMilliseconds) {
      //       thisMonthVisitors.push(data);
      //     }
      //   });
      //   return {
      //     thisMonthVisitors: thisMonthVisitors.length,
      //     allVisitors: trackingData.length
      //   };
      // })
    );
  }
}
