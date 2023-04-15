import { Component, OnInit } from '@angular/core';
import { Material } from '@core/models/material.model';
import { sortedMaterialsSelector } from '@core/store';
import { Store } from '@ngrx/store';

import { filter, map, Observable } from 'rxjs';

// import coreSelectors from 'src/app/core/store/selectors';

interface FilteredAvailableMaterials {
  [key: string]: Material[];
}

@Component({
  selector: 'masni-handmade-dolls-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.scss']
})
export class SamplesComponent implements OnInit {
  public sortedMaterials$: Observable<FilteredAvailableMaterials>;
  public activeIndexFirstGalery = 0;
  public displayCustomFirstGalery: boolean;
  public activeIndexSecondGalery = 0;
  public displayCustomSecondGalery: boolean;
  public activeIndexThirdGalery = 0;
  public displayCustomThirdGalery: boolean;

  constructor(private store$: Store) {}

  public ngOnInit(): void {
    this.sortedMaterials$ = this.store$.select(sortedMaterialsSelector).pipe(
      filter((sortedMaterials) => !!sortedMaterials),
      map((sortedMaterials) => {
        const filteredItemsByKeys: FilteredAvailableMaterials = Object.keys(
          sortedMaterials
        ).reduce((acc, key) => {
          const filteredItems = sortedMaterials[key].filter(
            (material: Material) => material.isAvailable
          );

          if (filteredItems.length > 0) {
            acc[key] = filteredItems;
          }

          return acc;
        }, {});
        return filteredItemsByKeys;
      })
    );
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
