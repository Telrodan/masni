import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    OnChanges,
    SimpleChange,
    ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCategory } from '@core/store/category/category.model';

interface CategoriesData {
    label: string;
    image: string;
    routerLink: string;
    count: number;
}

@Component({
    selector: 'nyk-categories',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent implements OnChanges {
    @HostBinding('class.nyk-categories') hostClass = true;

    @Input() productCategories: ProductCategory[];

    data: CategoriesData[];

    ngOnChanges(changes: { productCategories: SimpleChange }): void {
        if (changes.productCategories) {
            const subProductCategories: ProductCategory[] = changes.productCategories.currentValue
                .filter((subProductCategory: ProductCategory) => subProductCategory.isSubCategory)
                .filter(
                    (subProductCategory: ProductCategory) => subProductCategory.items.length > 0
                );

            this.data = subProductCategories.map((category: ProductCategory) => ({
                label: category.slug,
                image: category.image,
                routerLink: `/shop/${category.id}`,
                count: category.items.length
            }));
        }
    }

    trackByLabel(index: number, item: CategoriesData): string {
        return item.label;
    }
}
