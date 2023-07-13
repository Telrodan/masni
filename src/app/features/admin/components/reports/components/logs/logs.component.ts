import { Component, OnInit } from '@angular/core';
import { Log } from '@core/models/log.model';
import { LogService } from '@core/services/log.service';
import { Observable, map, tap } from 'rxjs';

@Component({
  selector: 'mhd-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  logsData$: Observable<{
    logs: Log[];
    userEmails: {
      label: string;
      value: string;
    }[];
    modules: {
      label: string;
      value: string;
    }[];
  }>;

  constructor(private logService: LogService) {}

  ngOnInit(): void {
    this.logsData$ = this.logService.getLogs().pipe(
      map((logs) => ({
        logs: logs.reverse(),
        userEmails: [...new Set(logs.map((log) => log.meta?.user))].map(
          (user) => ({ label: user, value: user })
        ),
        modules: [...new Set(logs.map((log) => log.meta?.module))].map(
          (module) => ({ label: module, value: module })
        )
      }))
    );
  }
}
