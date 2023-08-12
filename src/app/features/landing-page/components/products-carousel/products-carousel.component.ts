import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { filter, map, Observable } from 'rxjs';

import { selectAllProducts } from '@core/store';
import { Product } from '@core/models/product.model';

@Component({
  selector: 'mhd-products-carousel',
  templateUrl: './products-carousel.component.html',
  styleUrls: ['./products-carousel.component.scss']
})
export class ProductsCarouselComponent implements OnInit {
  products$: Observable<Product[]>;

  constructor(private store$: Store) {}

  ngOnInit(): void {
    this.products$ = this.store$.select(selectAllProducts).pipe(
      filter((products) => !!products.length),
      map((products) => {
        return products
          .filter((product) => product.category !== 'egyedi termékek')
          .filter((product) => product.stock > 0);
      })
    );
  }

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
