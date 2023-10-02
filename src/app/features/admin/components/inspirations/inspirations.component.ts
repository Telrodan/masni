import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { Observable, filter, map, switchMap, tap } from 'rxjs';

import { Inspiration } from '@core/models/inspiration.model';
import { InspirationService } from '@core/services/inspiration.service';
import { ToastrService } from '@core/services/toastr.service';
import { selectAllInspiration } from '@core/store/selectors/inspiration.selectors';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { AddInspirationComponent } from './components/add-inspiration/add-inspiration.component';
import { EditInspirationComponent } from './components/edit-inspiration/edit-inspiration.component';
import { Table } from 'primeng/table';

@Component({
  selector: 'mhd-inspirations',
  templateUrl: './inspirations.component.html',
  styleUrls: ['./inspirations.component.scss']
})
export class InspirationsComponent implements OnInit {
  inspirations$: Observable<Inspiration[]>;

  imageLoadedStatus: boolean[] = [];

  constructor(
    private store$: Store,
    private inspirationService: InspirationService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.inspirations$ = this.store$.select(selectAllInspiration).pipe(
      filter((inspirations) => !!inspirations),
      map((inspirations) => [...inspirations])
    );
  }

  onAddInspiration(): void {
    this.dialog.open(AddInspirationComponent, {
      minWidth: '40vw'
    });
  }

  onEditInspiration(inspiration: Inspiration): void {
    this.dialog.open(EditInspirationComponent, {
      minWidth: '40vw',
      data: inspiration
    });
  }

  onDeleteInspiration(inspiration: Inspiration): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        minWidth: '40vw',
        data: {
          message: `Biztos törölni szeretnéd "${inspiration.name}" inspirációt?`
        }
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => !!confirmed),
        switchMap(() =>
          this.inspirationService.deleteInspiration$(inspiration)
        ),
        tap(() => {
          this.toastr.success('Inspiráció törölve');
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
