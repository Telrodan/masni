import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { Log } from '@core/models/log.model';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'mhd-detailed-error-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, DividerModule],
  templateUrl: './detailed-error-dialog.component.html',
  styleUrls: ['./detailed-error-dialog.component.scss']
})
export class DetailedErrorDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public log: Log) {}
}
