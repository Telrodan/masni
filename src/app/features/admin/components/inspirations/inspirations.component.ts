import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

import { Observable, Subject, filter, startWith, switchMap, tap } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';
import { BadgeModule } from 'primeng/badge';

import { Inspiration } from '@core/models/inspiration.model';
import { InspirationService } from '@core/services/inspiration.service';
import { ToastrService } from '@core/services/toastr.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { AddInspirationComponent } from './add-inspiration/add-inspiration.component';

@Component({
    selector: 'nyk-inspirations',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        ImageModule,
        SkeletonModule,
        BadgeModule,
        RouterModule,
        SpinnerComponent,
        InputTextModule,
        TooltipModule
    ],
    templateUrl: './inspirations.component.html',
    styleUrls: ['./inspirations.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspirationsComponent implements OnInit {
    @HostBinding('class') hostClass = 'nyk-inspirations';

    inspirations$: Observable<Inspiration[]>;
    imageLoadedStatus: boolean[] = [];
    isLoading = false;

    private deleteInspirationSubject = new Subject<void>();

    constructor(
        private inspirationService: InspirationService,
        private changeDetectorRef: ChangeDetectorRef,
        private dialog: MatDialog,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.inspirations$ = this.deleteInspirationSubject.pipe(
            startWith(null),
            switchMap(() => this.inspirationService.getInspirations$())
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
                    message: `Biztos törölni szeretnéd "${inspiration.name}" inspirációt?`
                }
            })
            .afterClosed()
            .pipe(
                filter((confirmed) => !!confirmed),
                tap(() => {
                    this.isLoading = true;
                    this.changeDetectorRef.detectChanges();
                }),
                switchMap(() =>
                    this.inspirationService.deleteInspiration$(inspiration)
                ),
                tap(() => {
                    this.isLoading = false;
                    this.deleteInspirationSubject.next();
                    this.toastr.success(
                        `${inspiration.name} inspiráció törölve`
                    );
                    this.changeDetectorRef.detectChanges();
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
