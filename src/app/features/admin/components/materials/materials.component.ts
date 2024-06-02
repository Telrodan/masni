import {
    Component,
    OnInit,
    ViewChild,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    HostBinding,
    inject
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, filter, map, tap } from 'rxjs';
import { Table, TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';

import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { Material } from '@core/store/material/material.model';
import { MaterialSelector } from '@core/store/material/material.selectors';
import { MaterialAction } from '@core/store/material';

@Component({
    selector: 'nyk-materials',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        TableModule,
        ButtonModule,
        ImageModule,
        SkeletonModule,
        BadgeModule,
        TooltipModule,
        InputTextModule,
        RouterModule,
        SpinnerComponent
    ],
    templateUrl: './materials.component.html',
    styleUrls: ['./materials.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class MaterialsComponent implements OnInit {
    @HostBinding('class') hostClass = 'nyk-materials';

    @ViewChild('table') materialsTable: Table;

    materials$: Observable<Material[]>;
    isBusy$: Observable<boolean>;

    imageLoadedStatus: boolean[] = [];

    private readonly store = inject(Store);
    private readonly dialog = inject(MatDialog);

    ngOnInit(): void {
        this.isBusy$ = this.store.select(MaterialSelector.isBusy());

        this.materials$ = this.store
            .select(MaterialSelector.selectMaterials())
            .pipe(map((materials) => [...materials]));
    }

    onDeleteMaterial(material: Material): void {
        this.dialog
            .open(ConfirmDialogComponent, {
                minWidth: '40vw',
                data: {
                    message: `Biztos törölni szeretnéd "${material.name}" mintát?`
                }
            })
            .afterClosed()
            .pipe(
                filter((confirmed) => !!confirmed),
                tap(() => {
                    this.store.dispatch(
                        MaterialAction.deleteMaterial({ id: material.id, name: material.name })
                    );
                })
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
