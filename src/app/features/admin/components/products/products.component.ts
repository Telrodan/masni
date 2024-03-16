import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { filter, Observable, startWith, Subject, switchMap, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Table, TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';

import { Product } from '@core/models/product.model';
import { ProductService } from '@core/services/product.service';
import { ToastrService } from '@core/services/toastr.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
    selector: 'nyk-products',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        TableModule,
        ButtonModule,
        ImageModule,
        SkeletonModule,
        BadgeModule,
        InputTextModule,
        RouterModule,
        SpinnerComponent,
        TooltipModule
    ],
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {
    @HostBinding('class') hostClass = 'nyk-products';

    products$: Observable<Product[]>;
    images: string[];
    imageLoadedStatus: boolean[] = [];
    isLoading = false;

    private productDeleteSubject = new Subject<void>();

    constructor(
        private productService: ProductService,
        private changeDetectorRef: ChangeDetectorRef,
        private dialog: MatDialog,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.products$ = this.productDeleteSubject.pipe(
            startWith(null),
            switchMap(() => this.productService.getProducts$())
        );
    }

    onDeleteProduct(product: Product): void {
        this.dialog
            .open(ConfirmDialogComponent, {
                minWidth: '40vw',
                data: {
                    message: `Biztos törölni szeretnéd "${product.name}" terméket?`
                }
            })
            .afterClosed()
            .pipe(
                filter((confirmed) => !!confirmed),
                tap(() => {
                    this.isLoading = true;
                    this.changeDetectorRef.detectChanges();
                }),
                switchMap(() => this.productService.deleteProduct$(product)),
                tap(() => {
                    this.isLoading = false;
                    this.productDeleteSubject.next();
                    this.toastr.success(`${product.name} termék törölve`);
                    this.changeDetectorRef.detectChanges();
                })
            )
            .subscribe();
    }

    imageLoaded(index: number) {
        this.imageLoadedStatus[index] = true;
    }

    applyTableGlobalFilter($event: any, stringVal: string, table: Table): void {
        const filter = ($event.target as HTMLInputElement).value;
        table.filterGlobal(filter, stringVal);
    }
}
