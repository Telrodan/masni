import { Component, OnInit } from '@angular/core';

import { ConfirmationService, MessageService } from 'primeng/api';
import { filter, Observable, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { CategoryService } from '@core/services/category.service';
import { categoriesSelector } from '@core/store';
import { Category } from '@core/models/category.model';

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
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
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
            this.messageService.add({
              severity: 'success',
              summary: 'Siker!',
              detail: `${this.categoryName} hozzáadva`
            });
            this.categoryName = '';
          })
        )
        .subscribe();
    }
  }

  onDeleteCategory(category: Category): void {
    this.confirmationService.confirm({
      message: `Biztos törölni szeretnéd ${category.categoryName} kategóriát?`,
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      accept: () => {
        this.categoryService
          .deleteCategory$(category._id)
          .pipe(
            tap(() => {
              this.messageService.add({
                severity: 'success',
                summary: 'Siker!',
                detail: `${category.categoryName} törölve`
              });
            })
          )
          .subscribe();
      }
    });
  }

  onEditCategory(category: Category): void {
    this.newCategoryName = category.categoryName;
    this.editedCategory = {
      ...category,
      categoryName: this.newCategoryName
    };
    this.isDialogVisible = true;
  }

  onUpdateCategory(): void {
    if (this.newCategoryName.trim() !== '') {
      this.editedCategory.categoryName = this.newCategoryName;
      this.categoryService
        .updateCategory$(this.editedCategory)
        .pipe(
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Siker!',
              detail: `${this.editedCategory.categoryName} módosítva`
            });
            this.isDialogVisible = false;
          })
        )
        .subscribe();
    }
  }
}
