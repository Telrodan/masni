import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Category } from '@core/models/category.model';
import { Product } from '@core/models/product.model';
import {
  categoriesSelector,
  productsSelector,
  userSelector
} from '@core/store';
// import { availableProductsSelector } from '@core/store';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, filter, tap, map } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'masni-handmade-dolls-shop',
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
      map((user) => user.shoppingCart._id)
    );

    // this.categories$ = this.store.select(categoriesSelector).pipe(
    //   filter((categories) => !!categories),
    //   map((categories) => {
    //     const all: Category = {
    //       categoryName: 'Összes'
    //     };
    //     categories = categories.filter(
    //       (category) => category.categoryName !== 'egyedi termékek'
    //     );
    //     categories.unshift(all);
    //     return categories;
    //   })
    // );

    this.products$ = this.store.select(productsSelector).pipe(
      filter((products) => !!products),
      map((products) => {
        products = products.filter(
          (product) => product.category[0].categoryName !== 'egyedi termékek'
        );
        return products;
      }),
      untilDestroyed(this)
    );
  }
}
