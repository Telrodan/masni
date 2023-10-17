import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Log } from '@core/models/log.model';

@Component({
  selector: 'mhd-detailed-error-dialog',
  templateUrl: './detailed-error-dialog.component.html',
  styleUrls: ['./detailed-error-dialog.component.scss']
})
export class DetailedErrorDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public log: Log) {}
}
