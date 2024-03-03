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

import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import { ProductCategory } from '@core/models/category.model';
import { SliderItem } from '@core/models/slider-item.model';
import { SliderItemComponent } from './slider-item/slider-item.component';

@Component({
  selector: 'nyk-slider',
  standalone: true,
  imports: [CommonModule, CarouselModule, SliderItemComponent],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SliderComponent implements OnChanges {
  @HostBinding('class.nyk-slider') hostClass = true;

  @Input() productCategories: ProductCategory[];

  data: SliderItem[];

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 10000,
    autoplayHoverPause: false,
    autoplaySpeed: 1000,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 1000,
    navText: [
      '<i class="pi pi-chevron-left"></i>',
      '<i class="pi pi-chevron-right"></i>'
    ],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      }
    },
    nav: true
  };

  ngOnChanges(changes: { productCategories: SimpleChange }) {
    if (changes.productCategories) {
      const mainCategories: ProductCategory[] =
        changes.productCategories.currentValue.filter(
          (category: ProductCategory) => !category.isSubCategory
        );

      this.data = mainCategories.map((category) => ({
        label: category.name,
        image: category.image,
        fromPrice: this.findLowestPrice(category.subCategories),
        routerLink: `/shop/${category.id}`
      }));
    }
  }

  trackByLabel(index: number, item: SliderItem) {
    return item.label;
  }

  private findLowestPrice(subCategories: ProductCategory[]): number {
    if (subCategories.length === 0) {
      return 0;
    }

    let minValue = 5000000000;

    subCategories.forEach((category) => {
      category.items.forEach((product) => {
        if (product.price < minValue) {
          minValue = product.price;
        }
      });
    });
    return minValue;
  }
}
