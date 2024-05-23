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

import { filter, map, Observable, Subject, switchMap, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
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
import { CategoryService } from '@core/services/category.service';
import { ToastrService } from '@core/services/toastr.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { Store } from '@ngrx/store';
import { CategorySelector } from '@core/store/category';

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
export class CategoriesComponent implements OnInit {
    @HostBinding('class') hostClass = 'nyk-categories';

    categories$: Observable<Category[]>;
    isBusy$: Observable<boolean>;

    images: string[] = [];
    imageLoadedStatus: boolean[] = [];

    isLoading = false;

    readonly CategoryType = CategoryType;
    private categoryDeleteSubject = new Subject<void>();

    constructor(
        private categoryService: CategoryService,
        private changeDetectorRef: ChangeDetectorRef,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private store: Store
    ) {}

    ngOnInit(): void {
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
                tap(() => {
                    this.isLoading = true;
                    this.changeDetectorRef.detectChanges();
                }),
                switchMap(() => this.categoryService.deleteCategory$(category.id)),
                tap(() => {
                    this.isLoading = false;
                    this.categoryDeleteSubject.next();
                    this.changeDetectorRef.detectChanges();
                    this.toastr.success(`${category.name} kategória törölve`);
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
