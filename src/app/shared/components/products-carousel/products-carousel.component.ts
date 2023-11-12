import {
  Component,
  HostBinding,
  Input,
  ViewEncapsulation
} from '@angular/core';

import { Product } from '@core/models/product.model';
import { responsiveOptions } from '@shared/util/carousel-option';

@Component({
  selector: 'mhd-products-carousel',
  templateUrl: './products-carousel.component.html',
  styleUrls: ['./products-carousel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductsCarouselComponent {
  @HostBinding('class.mhd-products-carousel') class = true;

  @Input() header: string;
  @Input() products: Product[];
  @Input() path: string;

  readonly responsiveOptions = responsiveOptions;
}
