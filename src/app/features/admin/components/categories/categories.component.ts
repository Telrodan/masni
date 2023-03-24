import { Component, OnInit } from '@angular/core';

import { MessageService } from 'primeng/api';
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

  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.categories$ = this.store.select(categoriesSelector).pipe(
      filter((categories) => !!categories),
      untilDestroyed(this)
    );
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

  onDeleteCategory(id: string, categoryName: string): void {
    this.categoryService
      .deleteCategory$(id)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Siker!',
            detail: `${categoryName} törölve`
          });
        })
      )
      .subscribe();
  }
}
