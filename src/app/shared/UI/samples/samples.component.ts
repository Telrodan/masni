import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import coreActions from 'src/app/core/core-ngrx/actions';
import coreSelectors from 'src/app/core/core-ngrx/selectors';
import { SortedMaterials } from 'src/app/core/models/sorted-materials.model';
import { MaterialService } from 'src/app/core/services/material.service';

@Component({
  selector: 'masni-handmade-dolls-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.scss']
})
export class SamplesComponent implements OnInit {
  public sortedMaterials: Observable<SortedMaterials>;
  public activeIndexFirstGalery = 0;
  public displayCustomFirstGalery: boolean;
  public activeIndexSecondGalery = 0;
  public displayCustomSecondGalery: boolean;
  public activeIndexThirdGalery = 0;
  public displayCustomThirdGalery: boolean;

  constructor(private store$: Store) {}

  public ngOnInit(): void {
    this.sortedMaterials = this.store$.select(
      coreSelectors.selectSortedMaterials
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
