import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Inject,
    ViewEncapsulation,
    inject
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Log } from '@core/store/log';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'nyk-detailed-log',
    standalone: true,
    imports: [CommonModule, BadgeModule, ButtonModule, MatDialogModule],
    templateUrl: './detailed-log.component.html',
    styleUrl: './detailed-log.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailedLogComponent {
    @HostBinding('class') class = 'nyk-detailed-log';

    constructor(@Inject(MAT_DIALOG_DATA) public log: Log) {}

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
}
