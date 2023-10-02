import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SpinnerService } from 'src/app/core/services/spinner.service';

@Component({
  selector: 'mhd-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  public isLoading = true;
  private destroy = new Subject();

  constructor(private spinnerService: SpinnerService) {}

  public ngOnInit(): void {
    this.spinnerService
      .getSpinnerStatus()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => {
        this.isLoading = result;
      });
  }
}
