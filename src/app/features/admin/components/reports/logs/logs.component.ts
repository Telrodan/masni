import {
    ChangeDetectionStrategy,
    Component,
    Host,
    HostBinding,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Log } from '@core/store/log/log.model';
import { LogService } from '@core/services/log.service';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DetailedLogComponent } from '../detailed-log/detailed-log.component';

@Component({
    selector: 'nyk-logs',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        MultiSelectModule,
        FormsModule,
        InputTextModule,
        TooltipModule,
        BadgeModule,
        ButtonModule
    ],
    templateUrl: './logs.component.html',
    styleUrls: ['./logs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class LogsComponent implements OnInit {
    @HostBinding('class') hostClass = 'nyk-logs';

    logs$: Observable<Log[]>;

    constructor(private logService: LogService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.logs$ = this.logService.getLogs();
    }

    onDetailedLog(log: Log): void {
        this.dialog.open(DetailedLogComponent, {
            data: log,
            minWidth: '40vw'
        });
    }

    getBadgeSeverity(log: Log): 'info' | 'warning' | 'danger' | 'primary' {
        switch (log.level) {
            case 'info':
                return 'info';
            case 'warning':
                return 'warning';
            case 'error':
                return 'danger';
            default:
                return 'primary';
        }
    }

    getBadgeIcon(log: Log): string {
        switch (log.level) {
            case 'info':
                return 'pi pi-info-circle shadow-2';
            case 'warning':
                return 'pi pi-question-circle shadow-2';
            case 'error':
                return 'pi pi-minus-circle shadow-2';
            default:
                return '';
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    applyTableGlobalFilter($event: any, stringVal: string, table: Table): void {
        const filter = ($event.target as HTMLInputElement).value;

        table.filterGlobal(filter, stringVal);
    }
}
