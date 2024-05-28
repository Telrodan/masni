import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    OnInit,
    ViewEncapsulation,
    inject
} from '@angular/core';
import { Router } from '@angular/router';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { cloneDeep } from 'lodash';

import { Category } from '@core/models/category.model';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { CategoryAction, CategorySelector } from '@core/store/category';

export interface CategorySortItem {
    id: string;
    sortIndex: number;
}

export interface CategoryOrderData {
    isSubCategory: boolean;
    categories: CategorySortItem[];
}

@Component({
    selector: 'nyk-order-categories',
    standalone: true,
    imports: [CommonModule, CdkDrag, CdkDropList, DividerModule, ButtonModule, SpinnerComponent],
    templateUrl: './order-categories.component.html',
    styleUrls: ['./order-categories.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderCategoriesComponent implements OnInit {
    @HostBinding('class') class = 'nyk-order-categories';

    categories$: Observable<Category[]>;
    selectedCategory: Category;
    isMainCategoriesOrderChanged = false;
    isSubCategoriesOrderChanged = false;

    private readonly store = inject(Store);
    private readonly router = inject(Router);

    ngOnInit(): void {
        this.categories$ = this.store.select(CategorySelector.selectMainProductCategories()).pipe(
            map((categories) => {
                categories = categories.sort((a, b) => a.sortIndex - b.sortIndex);
                return cloneDeep(categories);
            })
        );
    }

    dropMainCategory(items: Category[], event: CdkDragDrop<string[]>) {
        moveItemInArray(items, event.previousIndex, event.currentIndex);
        this.isMainCategoriesOrderChanged = true;
    }

    dropSubCategory(items: Category[], event: CdkDragDrop<string[]>) {
        moveItemInArray(items, event.previousIndex, event.currentIndex);
        this.isSubCategoriesOrderChanged = true;
    }

    onSelectCategory(category: Category) {
        category.subCategories = category.subCategories.sort((a, b) => a.sortIndex - b.sortIndex);
        this.selectedCategory = cloneDeep(category);
    }

    onUpdateCategoryOrder(categories: Category[], isSubCategory: boolean) {
        const categoryOrderData: CategoryOrderData = {
            isSubCategory,
            categories: []
        };

        categories.forEach((category, index) => {
            categoryOrderData.categories.push({
                id: category.id,
                sortIndex: index + 1
            });
        });

        this.store.dispatch(CategoryAction.updateCategoriesOrder({ categoryOrderData }));
        this.router.navigate(['/admin/categories']);
    }
}
