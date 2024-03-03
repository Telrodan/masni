import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Log } from '@core/models/log.model';
import { LogService } from '@core/services/log.service';
import { Observable, map } from 'rxjs';
import { DetailedErrorDialogComponent } from '../detailed-error-dialog/detailed-error-dialog.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'nyk-logs',
  standalone: true,
  imports: [CommonModule, TableModule, MultiSelectModule, FormsModule],
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

  constructor(private logService: LogService, private dialog: MatDialog) {}

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

  onDetailedError(log: Log): void {
    this.dialog.open(DetailedErrorDialogComponent, {
      data: log,
      minWidth: '40vw'
    });
  }
}
