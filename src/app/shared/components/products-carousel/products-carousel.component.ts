import { Component, Input } from '@angular/core';

import { Product } from '@core/models/product.model';

@Component({
  selector: 'mhd-products-carousel',
  templateUrl: './products-carousel.component.html',
  styleUrls: ['./products-carousel.component.scss']
})
export class ProductsCarouselComponent {
  @Input() title: string;
  @Input() products: Product[];
  @Input() link: string;

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
}
