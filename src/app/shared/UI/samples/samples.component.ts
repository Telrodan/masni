import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { Material } from 'src/app/core/models/material.model';
import { SortedMaterials } from 'src/app/core/models/sorted-materials.model';
import { MaterialService } from 'src/app/core/services/material.service';

@Component({
  selector: 'masni-handmade-dolls-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.scss']
})
export class SamplesComponent implements OnInit, OnDestroy {
  public sortedMaterials: SortedMaterials;
  public activeIndexFirstGalery = 0;
  public displayCustomFirstGalery: boolean;
  public activeIndexSecondGalery = 0;
  public displayCustomSecondGalery: boolean;
  public activeIndexThirdGalery = 0;
  public displayCustomThirdGalery: boolean;
  private destroy = new Subject<null>();

  constructor(private materialService: MaterialService) {}

  public ngOnInit(): void {
    this.materialService
      .getSortedMaterials$()
      .pipe(takeUntil(this.destroy))
      .subscribe((response) => {
        this.sortedMaterials = response;
      });
  }

  public ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
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
