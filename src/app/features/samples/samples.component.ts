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
  sortedMaterials$: Observable<FilteredAvailableMaterials>;

  activeIndexGaleryOne = 0;
  displayCustomGaleryOne: boolean;

  activeIndexGaleryTwo = 0;
  displayCustomGaleryTwo: boolean;

  activeIndexGaleryThree = 0;
  displayCustomGaleryThree: boolean;

  activeIndexGaleryFour = 0;
  displayCustomGaleryFour: boolean;

  activeIndexGaleryFive = 0;
  displayCustomGaleryFive: boolean;

  activeIndexGalerySix = 0;
  displayCustomGalerySix: boolean;

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

  imageClickGaleryOne(index: number): void {
    this.activeIndexGaleryOne = index;
    this.displayCustomGaleryOne = true;
  }

  imageClickGaleryTwo(index: number): void {
    this.activeIndexGaleryTwo = index;
    this.displayCustomGaleryTwo = true;
  }

  imageClickGaleryThree(index: number): void {
    this.activeIndexGaleryThree = index;
    this.displayCustomGaleryThree = true;
  }

  imageClickGaleryFour(index: number): void {
    this.activeIndexGaleryFour = index;
    this.displayCustomGaleryFour = true;
  }

  imageClickGaleryFive(index: number): void {
    this.activeIndexGaleryFive = index;
    this.displayCustomGaleryFive = true;
  }

  imageClickGalerySix(index: number): void {
    this.activeIndexGalerySix = index;
    this.displayCustomGalerySix = true;
  }
}
