import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Inject,
    ViewEncapsulation
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { ConfirmDialogData } from '@core/models/confirm-dialog-data.model';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'nyk-confirm-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, ButtonModule],
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ConfirmDialogComponent {
    @HostBinding('class') hostClass = 'nyk-confirm-dialog';
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
        private dialogRef: MatDialogRef<ConfirmDialogComponent>
    ) {}

    onConfirm(): void {
        this.dialogRef.close(true);
    }
}
