import {
    Component,
    OnInit,
    ViewChild,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    HostBinding,
    ChangeDetectorRef
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Observable, Subject, filter, startWith, switchMap, tap } from 'rxjs';
import { Table, TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';

import { Material } from '@core/models/material.model';
import { MaterialService } from '@core/services/material.service';
import { ToastrService } from '@core/services/toastr.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

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
    imageLoadedStatus: boolean[] = [];
    isLoading = false;

    private materialDeleteSubject = new Subject<void>();

    constructor(
        private materialService: MaterialService,
        private changeDetectorRef: ChangeDetectorRef,
        private toastr: ToastrService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.materials$ = this.materialDeleteSubject.pipe(
            startWith(null),
            switchMap(() => this.materialService.getMaterials$())
        );
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
                    this.isLoading = true;
                    this.changeDetectorRef.detectChanges();
                }),
                switchMap(() => this.materialService.deleteMaterial$(material)),
                tap(() => {
                    this.isLoading = false;
                    this.materialDeleteSubject.next();
                    this.toastr.success(`${material.name} minta törölve`);
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
