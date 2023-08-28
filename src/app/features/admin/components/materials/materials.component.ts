import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, filter, map, switchMap, tap } from 'rxjs';
import { Table } from 'primeng/table';

import { selectAllMaterials } from '@core/store';
import { Material } from '@core/models/material.model';
import { MaterialService } from '@core/services/material.service';
import { ToastrService } from '@core/services/toastr.service';
import { ConfirmDialogComponent } from 'src/app/shared/UI/confirm-dialog/confirm-dialog.component';
import { EditMaterialComponent } from './components/edit-material/edit-material.component';
import { AddMaterialComponent } from './components/add-material/add-material.component';

@UntilDestroy()
@Component({
  selector: 'mhd-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialsComponent implements OnInit {
  @ViewChild('table') materialsTable: Table;

  materials$: Observable<Material[]>;

  imageLoadedStatus: boolean[] = [];

  constructor(
    private store$: Store,
    private materialService: MaterialService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.materials$ = this.store$.select(selectAllMaterials).pipe(
      map((materials) => [...materials]),

      untilDestroyed(this)
    );
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
          message: `Biztos törölni szeretnéd "${material.name}" mintát?`,
          confirmButtonText: 'Igen',
          cancelButtonText: 'Nem'
        }
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => !!confirmed),
        switchMap(() => this.materialService.deleteMaterial$(material)),
        tap(() => {
          this.toastr.success(`${material.name} minta törölve`);
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
  }
}
