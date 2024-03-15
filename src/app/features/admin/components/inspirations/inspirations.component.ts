import {
    ChangeDetectionStrategy,
    Component,
    Host,
    HostBinding,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable, filter, map, switchMap, tap } from 'rxjs';

import { Inspiration } from '@core/models/inspiration.model';
import { InspirationService } from '@core/services/inspiration.service';
import { ToastrService } from '@core/services/toastr.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { AddInspirationComponent } from './add-inspiration/add-inspiration.component';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';
import { BadgeModule } from 'primeng/badge';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

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

    constructor(
        private inspirationService: InspirationService,
        private dialog: MatDialog,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.inspirations$ = this.inspirationService.getInspirations$();
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
