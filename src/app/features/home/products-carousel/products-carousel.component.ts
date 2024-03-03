import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import { Product } from '@core/models/product.model';
import { ProductCardComponent } from '@shared/product-card/product-card.component';

@Component({
  selector: 'nyk-products-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule, CarouselModule, ProductCardComponent],
  templateUrl: './products-carousel.component.html',
  styleUrls: ['./products-carousel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsCarouselComponent {
  @HostBinding('class.nyk-products-carousel') hostClass = true;

  @Input() title: string;
  @Input() products: Product[];
  @Input() routerLink: string;

  @Output() likeProduct = new EventEmitter<Product>();

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 10000,
    autoplayHoverPause: true,
    autoplaySpeed: 1000,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 1000,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: false
  };

  onLikeProduct() {
    this.likeProduct.emit();
  }

  trackById(index: number, product: Product) {
    return product.id;
  }
}
