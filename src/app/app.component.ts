import { Component, OnInit } from '@angular/core';
import { MaterialService } from './core/services/material.service';

@Component({
  selector: 'masni-handmade-dolls-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'masni-handmade-dolls';
  public isLoading = true;

  constructor(private materialSerivice: MaterialService) {}

  public ngOnInit(): void {
    this.materialSerivice.fetchMaterials().subscribe(() => {
      this.isLoading = false;
    });
  }
}
