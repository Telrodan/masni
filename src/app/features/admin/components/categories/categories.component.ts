import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { Table } from 'primeng/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map, Observable, switchMap, tap } from 'rxjs';

import { selectAllCategories } from '@core/store';
import { Category } from '@core/models/category.model';
import { CategoryType } from '@core/enums/category-type.enum';
import { CategoryService } from '@core/services/category.service';
import { ToastrService } from '@core/services/toastr.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { EditCategoryComponent } from './components/edit-category/edit-category.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';

@UntilDestroy()
@Component({
  selector: 'mhd-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent implements OnInit {
  readonly CategoryType = CategoryType;

  categories$: Observable<Category[]>;

  images: string[] = [];
  imageLoadedStatus: boolean[] = [];

  constructor(
    private store: Store,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.categories$ = this.store.select(selectAllCategories).pipe(
      filter((categories) => !!categories),
      map((categories) => [...categories]),
      untilDestroyed(this)
    );
  }

  onAddCategory(): void {
    this.dialog.open(AddCategoryComponent, {
      minWidth: '40vw'
    });
  }

  onEditCategory(category: Category): void {
    this.dialog.open(EditCategoryComponent, {
      minWidth: '40vw',
      data: category
    });
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
        switchMap(() => this.categoryService.deleteCategory$(category.id)),
        tap(() => {
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
