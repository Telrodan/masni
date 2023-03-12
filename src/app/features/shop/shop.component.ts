import { Component, OnInit } from '@angular/core';
import { Product } from '@core/models/product.model';
import { availableProductsSelector } from '@core/store';

import { UntilDestroy } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, filter, tap } from 'rxjs';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'masni-handmade-dolls-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  public availableProducts$: Observable<Product[]>;

  constructor(private store$: Store) {}

  public ngOnInit(): void {
    this.availableProducts$ = this.store$
      .select(availableProductsSelector)
      .pipe(filter((products) => !!products));
  }
}
