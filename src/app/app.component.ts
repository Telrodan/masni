import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MaterialService } from './core/services/material.service';
import { SpinnerService } from './core/services/spinner.service';

@Component({
  selector: 'masni-handmade-dolls-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService]
})
export class AppComponent implements OnInit {
  title = 'masni-handmade-dolls';
  public isLoading = true;

  constructor(
    private materialSerivice: MaterialService,
    private spinnerService: SpinnerService
  ) {}

  public ngOnInit(): void {
    this.spinnerService.getSpinnerStatus().subscribe((result) => {
      this.isLoading = result;
    });

    this.materialSerivice.fetchMaterials().subscribe(() => {
      this.spinnerService.stopSpinner();
    });
  }
}
