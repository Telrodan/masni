import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductCategory } from '@core/models/category.model';
import { RouterModule } from '@angular/router';

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

  ngOnChanges(changes: SimpleChanges): void {
    const { productCategories } = changes;

    if (productCategories) {
      this.data = productCategories.currentValue
        .map((category: ProductCategory) => ({
          label: category.name,
          image: category.image,
          routerLink: `/shop/${category.id}`,
          count: category.items.length
        }))
        .filter((category: CategoriesData) => category.count > 0);
    }
  }
}
