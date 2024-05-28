import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    inject,
    ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { filter, map, Observable, tap } from 'rxjs';
import { Table, TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';

import { Category } from '@core/models/category.model';
import { CategoryType } from '@core/enums/category-type.enum';
import { CategoryAction, CategorySelector } from '@core/store/category';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
    selector: 'nyk-categories',
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
        SpinnerComponent,
        ConfirmDialogComponent
    ],
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class CategoriesComponent {
    @HostBinding('class') hostClass = 'nyk-categories';

    categories$: Observable<Category[]>;
    isBusy$: Observable<boolean>;

    imageLoadedStatus: boolean[] = [];

    readonly CategoryType = CategoryType;

    private readonly store = inject(Store);
    private readonly dialog = inject(MatDialog);

    constructor() {
        this.isBusy$ = this.store.select(CategorySelector.isBusy());

        this.categories$ = this.store
            .select(CategorySelector.selectCategories())
            .pipe(map((categories) => [...categories]));
    }

    onDeleteCategory(category: Category): void {
        this.dialog
            .open(ConfirmDialogComponent, {
                minWidth: '40vw',
                data: {
                    message: `Biztos törölni szeretnéd "${category.name}" kategóriát?`
                }
            })
            .afterClosed()
            .pipe(
                filter((confirmed) => !!confirmed),
                tap(() =>
                    this.store.dispatch(
                        CategoryAction.deleteCategory({ id: category.id, name: category.name })
                    )
                )
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
