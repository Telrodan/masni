import { Component, OnInit } from '@angular/core';
import { sortedMaterialsSelector } from '@core/store';
import { Store } from '@ngrx/store';

import { filter, Observable } from 'rxjs';

// import coreSelectors from 'src/app/core/store/selectors';
import { SortedMaterials } from 'src/app/core/models/sorted-materials.model';

@Component({
  selector: 'masni-handmade-dolls-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.scss']
})
export class SamplesComponent implements OnInit {
  public sortedMaterials$: Observable<SortedMaterials>;
  public activeIndexFirstGalery = 0;
  public displayCustomFirstGalery: boolean;
  public activeIndexSecondGalery = 0;
  public displayCustomSecondGalery: boolean;
  public activeIndexThirdGalery = 0;
  public displayCustomThirdGalery: boolean;

  constructor(private store$: Store) {}

  public ngOnInit(): void {
    this.sortedMaterials$ = this.store$
      .select(sortedMaterialsSelector)
      .pipe(filter((sortedMaterials) => !!sortedMaterials));
  }

  public imageClickFirstGalery(index: number): void {
    this.activeIndexFirstGalery = index;
    this.displayCustomFirstGalery = true;
  }

  public imageClickSecondGalery(index: number): void {
    this.activeIndexSecondGalery = index;
    this.displayCustomSecondGalery = true;
  }

  public imageClickThirdGalery(index: number): void {
    this.activeIndexThirdGalery = index;
    this.displayCustomThirdGalery = true;
  }
}
