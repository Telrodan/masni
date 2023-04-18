import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Inspiration } from '@core/models/inspiration.model';
import { InspirationService } from '@core/services/inspiration.service';
import { ToastrService } from '@core/services/toastr.service';
import { Observable, filter, switchMap, tap } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/UI/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'masni-handmade-dolls-inspiration-list',
  templateUrl: './inspiration-list.component.html',
  styleUrls: ['./inspiration-list.component.scss']
})
export class InspirationListComponent implements OnInit {
  inspirations$: Observable<Inspiration[]>;

  constructor(
    private inspirationService: InspirationService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.inspirations$ = this.inspirationService.fetchInspirations$();
  }

  onDeleteInspiration(inspiration: Inspiration): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Megerősítés',
          message: `Biztos törölni szeretnéd az inspirációt?`,
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
          this.toastr.success('Siker', 'Inspiráció törölve');
        })
      )
      .subscribe();
  }
}
