import { Component, OnInit } from '@angular/core';

import { filter, Observable, switchMap, tap } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { CategoryService } from '@core/services/category.service';
import { categoriesSelector } from '@core/store';
import { Category } from '@core/models/category.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/UI/confirm-dialog/confirm-dialog.component';
import { ToastrService } from '@core/services/toastr.service';
import { CategoryNameDialogComponent } from './components/category-name-dialog/category-name-dialog.component';

@UntilDestroy()
@Component({
  selector: 'masni-handmade-dolls-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories$: Observable<Category[]>;
  categoryName: string;
  newCategoryName: string;
  editedCategory: Category;
  isDialogVisible = false;

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.categories$ = this.store
      .select(categoriesSelector)
      .pipe(filter((categories) => !!categories));
  }

  onAddCategory(): void {
    if (this.categoryName.trim()) {
      this.categoryService
        .addCategory$(this.categoryName)
        .pipe(
          tap(() => {
            this.toastr.success('Siker', `${this.categoryName} hozzáadva`);
            this.categoryName = '';
          })
        )
        .subscribe();
    }
  }

  onDeleteCategory(category: Category): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        minWidth: '50vw',
        data: {
          title: 'Megerősítés',
          message: `Biztos törölni szeretnéd "${category.categoryName}" kategóriát?`,
          confirmButtonText: 'Igen',
          cancelButtonText: 'Nem'
        }
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => !!confirmed),
        switchMap(() => this.categoryService.deleteCategory$(category._id)),
        tap(() => {
          this.toastr.success('Siker', `${category.categoryName} törölve`);
        })
      )
      .subscribe();
  }

  onEditCategory(category: Category): void {
    this.dialog.open(CategoryNameDialogComponent, {
      minWidth: '50vw',
      data: category
    });
  }

  onUpdateCategory(): void {
    if (this.newCategoryName.trim() !== '') {
      this.editedCategory.categoryName = this.newCategoryName;
      this.categoryService
        .updateCategory$(this.editedCategory)
        .pipe(
          tap(() => {
            this.toastr.success(
              'Siker',
              `${this.editedCategory.categoryName} módosítva`
            );
            this.isDialogVisible = false;
          })
        )
        .subscribe();
    }
  }
}
