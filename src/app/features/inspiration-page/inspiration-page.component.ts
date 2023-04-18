import { Component, OnInit } from '@angular/core';
import { Inspiration } from '@core/models/inspiration.model';
import { InspirationService } from '@core/services/inspiration.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'masni-handmade-dolls-inspiration-page',
  templateUrl: './inspiration-page.component.html',
  styleUrls: ['./inspiration-page.component.scss']
})
export class InspirationPageComponent implements OnInit {
  inspirations$: Observable<Inspiration[]>;
  activeIndexGaleryOne = 0;
  displayCustomGaleryOne: boolean;

  constructor(private inspirationService: InspirationService) {}

  ngOnInit(): void {
    this.inspirations$ = this.inspirationService.fetchInspirations$();
  }

  imageClickGaleryOne(index: number): void {
    this.activeIndexGaleryOne = index;
    this.displayCustomGaleryOne = true;
  }
}
