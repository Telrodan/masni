import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    inject,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { filter, map, Observable, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
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
import { Product } from '@core/store/product/product.model';
import { ProductAction, ProductSelector } from '@core/store/product';

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
    isBusy$: Observable<boolean>;

    imageLoadedStatus: boolean[] = [];

    private readonly store = inject(Store);
    private readonly dialog = inject(MatDialog);

    ngOnInit(): void {
        this.isBusy$ = this.store.select(ProductSelector.isBusy());

        this.products$ = this.store
            .select(ProductSelector.selectProducts())
            .pipe(map((products) => [...products]));
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
                    this.store.dispatch(
                        ProductAction.deleteProduct({ id: product.id, name: product.name })
                    );
                })
            )
            .subscribe();
    }

    imageLoaded(index: number) {
        this.imageLoadedStatus[index] = true;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    applyTableGlobalFilter($event: any, stringVal: string, table: Table): void {
        const filter = ($event.target as HTMLInputElement).value;
        table.filterGlobal(filter, stringVal);
    }
}
