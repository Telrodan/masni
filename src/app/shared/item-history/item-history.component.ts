import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    ViewEncapsulation
} from '@angular/core';
import { Log } from '@core/store/log';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'nyk-item-history',
    standalone: true,
    imports: [CommonModule, TableModule, BadgeModule, ButtonModule],
    templateUrl: './item-history.component.html',
    styleUrl: './item-history.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemHistoryComponent {
    @HostBinding('class') class = 'nyk-item-history';

    @Input() itemType: string;
    @Input() logs: Log[];
    @Input() createdAt: Date;
    @Input() updatedAt: Date;

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
