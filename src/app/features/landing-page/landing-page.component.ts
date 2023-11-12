import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { Store } from '@ngrx/store';
import { Observable, filter, map } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';

import { Product } from '@core/models/product.model';
import {
  selectAvailableMaterials,
  selectAvailableProducts,
  selectCustomProducts,
  selectFeaturedProducts,
  selectProductCategories
} from '@core/store';
import { Category } from '@core/models/category.model';
import { Material } from '@core/models/material.model';

@UntilDestroy()
@Component({
  selector: 'mhd-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  featuredProducts$: Observable<Product[]>;
  allProducts$: Observable<Product[]>;
  customProducts$: Observable<Product[]>;

  productCategories$: Observable<Category[]>;

  materials$: Observable<Material[]>;

  constructor(
    private store$: Store,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.titleService.setTitle('Nyuszkó Kuckó | Főoldal');
    this.metaService.addTags([
      {
        name: 'description',
        content:
          'Szeretném nektek bemutatni a Nyuszkó Kuckót, ahol kész és egyedi, akár kézzel hímzett névvel ellátott textil figurákat, pihe-puha szundikendőket találtok. Nagyon sok minta és szín közül válogathattok, hogy minden egyéniség megtalálja a hozzá leginkább illőt. Minden darab szeretettel és hatalmas odafigyeléssel készül. Termékeimet egészen újszülött kortól ajánlom, babák számára is teljesen biztonságos. Egy nyuszkó egészen óvodás korig hű társ lehet. A pihe-puha szundikendők pedig segítenek az elalvásban, csupa öröm hozzájuk bújni. Kiváló ajándék lehet babaváró bulira, keresztelőre, de újszülött fotózásokra is remek kellék lehet.'
      },
      {
        name: 'keywords',
        content:
          'babák, nyuszi, nyuszik, nyuszkó, nyuszkók, maci, macik, mackók, szundikendő, szundikendők, kézzel készített, webshop'
      },
      {
        property: 'og:title',
        content: 'Nyuszkó Kuckó | Főoldal'
      },
      {
        property: 'og:description',
        content:
          'Fedezze fel a legbájosabb és legkülönlegesebb kézzel készített nyuszkókat, mackókat, nyuszkó szundikendőket, mackó szundikendőket, babákat és kiegészítőket.'
      },
      {
        property: 'og:image',
        content: 'https://nyuszkokucko.hu/assets/images/nyuszko-kucko-logo.png'
      },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Nyuszkó Kuckó' }
    ]);
  }

  ngOnInit(): void {
    this.featuredProducts$ = this.store$.select(selectFeaturedProducts).pipe(
      filter((products) => products.length > 0),
      map((products) => products.slice(0, 6))
    );

    this.allProducts$ = this.store$.select(selectAvailableProducts).pipe(
      filter((products) => products.length > 0),
      map((products) => products.slice(0, 6))
    );

    this.customProducts$ = this.store$.select(selectCustomProducts).pipe(
      filter((products) => products.length > 0),
      map((products) => products.slice(0, 6))
    );

    this.productCategories$ = this.store$.select(selectProductCategories).pipe(
      filter((categories) => categories.length > 0),
      map((categories) =>
        categories.filter((category) => category.items.length)
      )
    );

    // this.materials$ = this.store$.select(selectAvailableMaterials).pipe(
    //   filter((materials) => materials.length > 0),
    //   map((materials) => materials.slice(0, 8))
    // );
  }
}
