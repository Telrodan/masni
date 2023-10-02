import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { map, combineLatest, startWith, switchMap, Observable } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';

import { Product } from '@core/models/product.model';
import { ShopPageData } from '@core/models/shop-page-data.model';
import {
  selectAvailableProducts,
  selectCategoryById,
  selectCustomProducts,
  selectFeaturedProducts
} from '@core/store';
import { Title, Meta } from '@angular/platform-browser';

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
  pageData$: Observable<ShopPageData>;

  filterForm = new FormGroup({
    price: new FormControl('Növekvő', Validators.required)
  });
  prices = [{ price: 'Csökkenő' }, { price: 'Növekvő' }];

  first = 0;
  rows = 8;

  constructor(
    private store$: Store,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    this.pageData$ = combineLatest([
      this.route.params.pipe(map((params) => params['id'])),
      this.filterForm
        .get('price')
        .valueChanges.pipe(startWith(this.filterForm.get('price').value))
    ]).pipe(
      switchMap(([id, price]) => {
        this.first = 0;

        switch (id) {
          case 'all':
            return this.store$.select(selectAvailableProducts).pipe(
              map((products) => ({
                category: 'Összes termék',
                image:
                  '../../../assets/images/landing-page/landing-page-01.jpg',
                products,
                priceFilter: price
              }))
            );
          case 'dream-it':
            return this.store$.select(selectCustomProducts).pipe(
              map((products) => ({
                category: '"Álmodd meg"',
                image:
                  '../../../assets/images/landing-page/landing-page-01.jpg',
                products,
                priceFilter: price
              }))
            );
          case 'featured':
            return this.store$.select(selectFeaturedProducts).pipe(
              map((products) => ({
                category: 'Kiemelt termékek',
                image:
                  '../../../assets/images/landing-page/landing-page-01.jpg',
                products,
                priceFilter: price
              }))
            );

          default:
            return this.store$.select(selectCategoryById(id)).pipe(
              map((category) => ({
                category: category.name,
                image: category.image,
                products: category.items as Product[],
                priceFilter: price
              }))
            );
        }
      }),
      map((pageData) => {
        if (pageData.priceFilter === 'Csökkenő') {
          pageData.products = pageData.products.sort(
            (a, b) => b.price - a.price
          );
        } else if (pageData.priceFilter === 'Növekvő') {
          pageData.products = pageData.products.sort(
            (a, b) => a.price - b.price
          );
        }

        this.titleService.setTitle(`Nyuszkó Kuckó | ${pageData.category}`);
        this.metaService.addTags([
          {
            name: 'description',
            content:
              'Böngessz termékeim között, és rendelj egyedi, kézzel készített nyuszkókat, mackókat, nyuszkó szundikendőket, mackó szundikendőket, babákat és kiegészítőket'
          },
          {
            name: 'keywords',
            content:
              'kapcsolat ,babák, nyuszi, nyuszik, nyuszkó, nyuszkók, maci, macik, mackók, szundikendő, szundikendők, kézzel készített, webshop'
          },
          {
            property: 'og:title',
            content: `Nyuszkó Kuckó | ${pageData.category}}`
          },
          {
            property: 'og:description',
            content:
              'Böngessz termékeim között, és rendelj egyedi, kézzel készített nyuszkókat, mackókat, nyuszkó szundikendőket, mackó szundikendőket, babákat és kiegészítőket'
          },
          {
            property: 'og:image',
            content: `${pageData.image}`
          },
          { name: 'robots', content: 'index, follow' },
          { name: 'author', content: 'Nyuszkó Kuckó' }
        ]);

        return pageData;
      })
    );
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
