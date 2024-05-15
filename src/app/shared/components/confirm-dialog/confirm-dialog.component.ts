import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfirmDialogData } from '@core/models/confirm-dialog-data.model';

@Component({
    selector: 'nyk-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
        private dialogRef: MatDialogRef<ConfirmDialogComponent>
    ) {}

    confirm(): void {
        this.dialogRef.close(true);
    }
}
