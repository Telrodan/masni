import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, filter, map, switchMap, tap } from 'rxjs';
import { Table } from 'primeng/table';

import { materialsSelector } from '@core/store';
import { Material } from '@core/models/material.model';
import { MaterialService } from '@core/services/material.service';
import { ToastrService } from '@core/services/toastr.service';
import { ConfirmDialogComponent } from 'src/app/shared/UI/confirm-dialog/confirm-dialog.component';
import { categories } from 'src/app/shared/util/material-categories';
import { EditMaterialComponent } from './components/edit-material/edit-material.component';
import { AddMaterialComponent } from './components/add-material/add-material.component';
import { capitalize } from 'src/app/shared/util/first-letter-capital';

@UntilDestroy()
@Component({
  selector: 'mhd-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit, AfterViewInit {
  @ViewChild('table') materialsTable: Table;

  materials$: Observable<Material[]>;
  categories = categories;

  images: string[];
  imageLoadedStatus: boolean[] = [];

  constructor(
    private store: Store,
    private materialService: MaterialService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.materials$ = this.store.select(materialsSelector).pipe(
      map((materials) => {
        this.reloadMaterialsImages(materials);

        return [...materials];
      }),
      untilDestroyed(this)
    );
  }

  ngAfterViewInit(): void {
    this.materialsTable.onSort
      .pipe(
        tap(() => {
          if (this.materialsTable.filteredValue) {
            this.reloadMaterialsImages(this.materialsTable.filteredValue);
          } else {
            this.reloadMaterialsImages(this.materialsTable.value);
          }
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  onAddMaterial(): void {
    this.dialog.open(AddMaterialComponent, {
      minWidth: '40vw'
    });
  }

  onEditMaterial(material: Material): void {
    this.dialog.open(EditMaterialComponent, {
      minWidth: '40vw',
      data: material
    });
  }

  onDeleteMaterial(material: Material): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        minWidth: '40vw',
        data: {
          title: 'Megerősítés',
          message: `Biztos törölni szeretnéd "${capitalize(
            material.name
          )}" mintát?`,
          confirmButtonText: 'Igen',
          cancelButtonText: 'Nem'
        }
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => !!confirmed),
        switchMap(() => this.materialService.deleteMaterial$(material)),
        tap(() => {
          this.toastr.success(`${capitalize(material.name)} minta törölve`);
        })
      )
      .subscribe();
  }

  imageLoaded(index: number) {
    this.imageLoadedStatus[index] = true;
  }

  applyFilterGlobal($event: any, stringVal: string, table: Table): void {
    const filter = ($event.target as HTMLInputElement).value;

    table.filterGlobal(filter, stringVal);

    if (filter !== '' && table.filteredValue) {
      this.reloadMaterialsImages(table.filteredValue);
    } else {
      this.reloadMaterialsImages(table.value);
    }
  }

  reloadMaterialsImages(materials: Material[]) {
    this.images = materials.map((material) => {
      const timestamp = new Date().getTime();

      return material.image + `?timestamp=${timestamp}`;
    });
    this.imageLoadedStatus = this.images.map(() => false);
  }
}
