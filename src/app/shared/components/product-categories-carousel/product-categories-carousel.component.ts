import { Component, Input } from '@angular/core';

import { Category } from '@core/models/category.model';

@Component({
  selector: 'mhd-product-categories-carousel',
  templateUrl: './product-categories-carousel.component.html',
  styleUrls: ['./product-categories-carousel.component.scss']
})
export class ProductCategoriesCarouselComponent {
  @Input() categories: Category[];

  imageLoadedStatus: boolean[] = [];

  responsiveOptions = [
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  imageLoaded(index: number) {
    this.imageLoadedStatus[index] = true;
  }
}
