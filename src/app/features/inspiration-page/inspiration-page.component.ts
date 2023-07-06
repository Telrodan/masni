import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, filter } from 'rxjs';

import { Inspiration } from '@core/models/inspiration.model';
import { selectAllInspiration } from '@core/store/selectors/inspiration.selectors';

@Component({
  selector: 'mhd-inspiration-page',
  templateUrl: './inspiration-page.component.html',
  styleUrls: ['./inspiration-page.component.scss']
})
export class InspirationPageComponent implements OnInit {
  inspirations$: Observable<Inspiration[]>;
  activeIndexGalery = 0;
  displayCustomGalery: boolean;

  constructor(private store$: Store) {}

  ngOnInit(): void {
    this.inspirations$ = this.store$
      .select(selectAllInspiration)
      .pipe(filter((inspirations) => !!inspirations));
  }

  imageClickGalery(index: number): void {
    this.activeIndexGalery = index;
    this.displayCustomGalery = true;
  }
}
