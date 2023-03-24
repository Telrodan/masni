import { Component, Input, OnInit } from '@angular/core';
import { Product } from '@core/models/product.model';
import { Store } from '@ngrx/store';
import { filter, Observable } from 'rxjs';
import { ProductService } from 'src/app/core/services/product.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { productsSelector } from '@core/store';
// import { availableProductsSelector } from '@core/store';

@UntilDestroy()
@Component({
  selector: 'masni-handmade-dolls-featured-products',
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.scss']
})
export class FeaturedProductsComponent implements OnInit {
  public products$: Observable<Product[]>;

  constructor(private store$: Store) {}

  public ngOnInit(): void {
    this.products$ = this.store$
      .select(productsSelector)
      .pipe(filter((products) => !!products));
  }

  public responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
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
