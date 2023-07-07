import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Inspiration } from '@core/models/inspiration.model';
import { InspirationService } from '@core/services/inspiration.service';
import { ToastrService } from '@core/services/toastr.service';
import { selectAllInspiration } from '@core/store/selectors/inspiration.selectors';
import { Store } from '@ngrx/store';
import { Observable, filter, map, switchMap, tap } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/UI/confirm-dialog/confirm-dialog.component';
import { AddInspirationComponent } from './components/add-inspiration/add-inspiration.component';

@Component({
  selector: 'mhd-inspirations',
  templateUrl: './inspirations.component.html',
  styleUrls: ['./inspirations.component.scss']
})
export class InspirationsComponent implements OnInit {
  inspirations$: Observable<Inspiration[]>;

  images: string[];
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
      map((inspirations) => {
        this.reloadInspirationsImages(inspirations);

        return [...inspirations];
      })
    );
  }

  onAddInspiration(): void {
    this.dialog.open(AddInspirationComponent, {
      minWidth: '40vw'
    });
  }

  onDeleteInspiration(inspiration: Inspiration): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        minWidth: '40vw',
        data: {
          title: 'Megerősítés',
          message: `Biztos törölni szeretnéd ${inspiration.id} azonosítójú inspirációt?`,
          confirmButtonText: 'Igen',
          cancelButtonText: 'Nem'
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

  reloadInspirationsImages(inspiration: Inspiration[]) {
    this.images = inspiration.map((inspiration) => {
      const timestamp = new Date().getTime();

      return inspiration.image + `?timestamp=${timestamp}`;
    });
    this.imageLoadedStatus = this.images.map(() => false);
  }
}
