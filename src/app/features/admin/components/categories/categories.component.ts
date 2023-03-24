import { Component, OnInit } from '@angular/core';
import { Category } from '@core/models/category.model';
import { CategoryService } from '@core/services/category.service';
import { tap } from 'rxjs';

@Component({
  selector: 'masni-handmade-dolls-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: Category[];
  categoryName: string;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService
      .getAllCategory$()
      .pipe(
        tap((categories) => {
          this.categories = categories;
        })
      )
      .subscribe();
  }

  addCategory(categoryName: string): void {
    if (this.categoryName) {
      this.categoryService
        .addCategory$(categoryName)
        .pipe(
          tap((category) => {
            category.products = [];
            this.categories.push(category);
            this.categoryName = '';
          })
        )
        .subscribe();
    }
  }

  deleteCategory(id: string): void {
    this.categoryService
      .deleteCategory$(id)
      .pipe(
        tap(() => {
          this.categories = this.categories.filter(
            (category) => category._id !== id
          );
        })
      )
      .subscribe();
  }
}
