import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    OnInit,
    ViewEncapsulation,
    inject
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, filter, map, tap } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';
import { BadgeModule } from 'primeng/badge';

import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { Inspiration } from '@core/store/inspiration/inspiration.model';
import { InspirationAction, InspirationSelector } from '@core/store/inspiration';

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
    isBusy$: Observable<boolean>;

    imageLoadedStatus: boolean[] = [];

    private readonly store = inject(Store);
    private readonly dialog = inject(MatDialog);

    ngOnInit(): void {
        this.isBusy$ = this.store.select(InspirationSelector.isBusy());

        this.inspirations$ = this.store
            .select(InspirationSelector.selectInspirations())
            .pipe(map((inspirations) => [...inspirations]));
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
                tap(() =>
                    this.store.dispatch(
                        InspirationAction.deleteInspiration({
                            id: inspiration.id,
                            name: inspiration.name
                        })
                    )
                )
            )
            .subscribe();
    }

    imageLoaded(index: number) {
        this.imageLoadedStatus[index] = true;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    applyFilterGlobal($event: any, stringVal: string, table: Table): void {
        const filter = ($event.target as HTMLInputElement).value;
        table.filterGlobal(filter, stringVal);
    }
}
