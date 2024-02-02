import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { CategoryService } from '@core/services/category.service';
import { Category } from '@core/models/category.model';
import { Observable, Subject, map, startWith, switchMap, tap } from 'rxjs';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ToastrService } from '@core/services/toastr.service';

export interface CategorySortItem {
  id: string;
  sortIndex: number;
}

export interface CategoryOrderData {
  isSubCategory: boolean;
  parentCategoryId?: string;
  categories: CategorySortItem[];
}

@Component({
  selector: 'nyk-order-categories',
  standalone: true,
  imports: [
    CommonModule,
    CdkDrag,
    CdkDropList,
    DividerModule,
    ButtonModule,
    SpinnerComponent
  ],
  templateUrl: './order-categories.component.html',
  styleUrls: ['./order-categories.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderCategoriesComponent implements OnInit {
  @HostBinding('class') class = 'nyk-order-categories';

  categories$: Observable<Category[]>;
  selectedCategory: Category;
  isMainCategoiesOrderChanged = false;
  isSubCategoiesOrderChanged = false;
  updateCategoriesOrderSubject = new Subject<void>();
  isLoading = false;

  constructor(
    private categoryService: CategoryService,
    private changeDetectorRef: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.categories$ = this.updateCategoriesOrderSubject.pipe(
      startWith(null),
      switchMap(() =>
        this.categoryService.getProductCategories$().pipe(
          map((categories) =>
            categories.filter((category) => !category.isSubCategory)
          ),
          tap((categories) => {
            if (categories.length > 0) {
              this.selectedCategory = categories[0];
            }
          })
        )
      )
    );
  }

  dropMainCategory(items: Category[], event: CdkDragDrop<string[]>) {
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.isMainCategoiesOrderChanged = true;
  }

  dropSubCategory(items: Category[], event: CdkDragDrop<string[]>) {
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.isSubCategoiesOrderChanged = true;
  }

  onSelectCategory(category: Category) {
    this.selectedCategory = category;
  }

  onUpdateMainCategoriesOrder(categories: Category[]) {
    this.isLoading = true;
    const categoryOrderData: CategoryOrderData = {
      isSubCategory: false,
      categories: []
    };
    categories.forEach((category, index) => {
      category.sortIndex = index + 1;
      categoryOrderData.categories.push({
        id: category.id,
        sortIndex: category.sortIndex
      });
    });

    this.categoryService
      .updateCategoriesOrder$(categoryOrderData)
      .pipe(
        tap(() => {
          this.isLoading = false;
          this.isMainCategoiesOrderChanged = false;
          this.isSubCategoiesOrderChanged = false;
          this.updateCategoriesOrderSubject.next();
          this.toastr.success('Főkategóriák sorrendje módosítva');
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe();
  }

  onUpdateSubCategoriesOrder(categories: Category[]) {
    this.isLoading = true;
    const categoryOrderData: CategoryOrderData = {
      isSubCategory: true,
      parentCategoryId: this.selectedCategory.id,
      categories: []
    };
    categories.forEach((category, index) => {
      category.sortIndex = index + 1;
      categoryOrderData.categories.push({
        id: category.id,
        sortIndex: category.sortIndex
      });
    });

    this.categoryService
      .updateCategoriesOrder$(categoryOrderData)
      .pipe(
        tap(() => {
          this.isLoading = false;
          this.isMainCategoiesOrderChanged = false;
          this.isSubCategoiesOrderChanged = false;
          this.updateCategoriesOrderSubject.next();
          this.toastr.success(
            `${this.selectedCategory.name} alkategóri sorrendje módosítva`
          );
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe();
  }
}
