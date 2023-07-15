import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { filter, map, combineLatest, startWith } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Product } from '@core/models/product.model';
import { selectAvailableProducts } from '@core/store';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@UntilDestroy()
@Component({
  selector: 'mhd-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShopComponent implements OnInit {
  products: Product[];
  categories: {
    category: string;
  }[];
  categoriesForm = new FormGroup({
    category: new FormControl('Összes', Validators.required),
    price: new FormControl('Növekvő', Validators.required)
  });
  prices = [{ price: 'Csökkenő' }, { price: 'Növekvő' }];

  first = 0;
  rows = 8;

  constructor(private store$: Store) {}

  ngOnInit(): void {
    combineLatest([
      this.store$.select(selectAvailableProducts).pipe(
        filter((products) => !!products),
        map((products) =>
          products.filter((product) => product.category !== 'egyedi termékek')
        )
      ),
      this.categoriesForm
        .get('category')
        .valueChanges.pipe(
          startWith(this.categoriesForm.get('category').value)
        ),
      this.categoriesForm
        .get('price')
        .valueChanges.pipe(startWith(this.categoriesForm.get('price').value))
    ])
      .pipe(
        map(([products, category, price]) => {
          const categoriesArr = [
            ...new Set(products.map((product) => product.category))
          ];
          this.first = 0;

          this.categories = categoriesArr.map((category) => ({
            category
          }));

          this.categories.unshift({ category: 'Összes' });
          this.products = products;

          if (category === 'Összes') {
            this.products = products;
          } else {
            this.products = products.filter(
              (product) => product.category === category
            );
          }

          if (price === 'Csökkenő') {
            this.products = this.products.sort((a, b) => b.price - a.price);
          } else if (price === 'Növekvő') {
            this.products = this.products.sort((a, b) => a.price - b.price);
          }
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  onPageChange(event: PageEvent): void {
    const shop = document.getElementById('shop');
    if (shop) {
      shop.scrollIntoView({ behavior: 'smooth' });
    }
    this.first = event.first;
    this.rows = event.rows;
  }
}
