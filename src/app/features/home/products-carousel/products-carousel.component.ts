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
    autoplayTimeout: 100000000,
    autoplayHoverPause: true,
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
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: true
  };

  onLikeProduct() {
    this.likeProduct.emit();
  }

  trackById(index: number, product: Product) {
    return product.id;
  }
}
