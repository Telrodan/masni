import {
    Component,
    OnInit,
    ViewChild,
    ChangeDetectionStrategy,
    ViewEncapsulation
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable, filter, switchMap, tap } from 'rxjs';
import { Table, TableModule } from 'primeng/table';

import { Material } from '@core/models/material.model';
import { MaterialService } from '@core/services/material.service';
import { ToastrService } from '@core/services/toastr.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { EditMaterialComponent } from './edit-material/edit-material.component';
import { AddMaterialComponent } from './add-material/add-material.component';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';

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
        RouterModule
    ],
    templateUrl: './materials.component.html',
    styleUrls: ['./materials.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class MaterialsComponent implements OnInit {
    @ViewChild('table') materialsTable: Table;

    materials$: Observable<Material[]>;

    imageLoadedStatus: boolean[] = [];

    constructor(
        private materialService: MaterialService,
        private toastr: ToastrService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.materials$ = this.materialService.getMaterials$();
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
                    message: `Biztos törölni szeretnéd "${material.name}" mintát?`
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
