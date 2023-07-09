import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Category } from '@core/models/category.model';
import { Product } from '@core/models/product.model';
import { selectAllProducts, userSelector } from '@core/store';
// import { availableProductsSelector } from '@core/store';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, filter, tap, map } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'mhd-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShopComponent implements OnInit {
  products$: Observable<Product[]>;
  categories$: Observable<Category[]>;
  cartId: string;

  constructor(private store: Store) {}

  public ngOnInit(): void {
    this.store.select(userSelector).pipe(
      filter((user) => !!user),
      map((user) => user.shoppingCart.id)
    );

    this.products$ = this.store.select(selectAllProducts).pipe(
      filter((products) => !!products),
      map((products) => {
        products = products.filter(
          (product) => product.category !== 'egyedi termékek'
        );

        return products.filter((product) => product.stock > 0);
      }),
      untilDestroyed(this)
    );
  }
}
