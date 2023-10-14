import {
  AfterViewChecked,
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { Store } from '@ngrx/store';
import {
  map,
  combineLatest,
  startWith,
  switchMap,
  Observable,
  filter
} from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';

import { Product } from '@core/models/product.model';
import { ShopPageData } from '@core/models/shop-page-data.model';
import {
  selectAvailableProducts,
  selectCategoryById,
  selectCustomProducts,
  selectDollDresses,
  selectFeaturedProducts
} from '@core/store';

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
export class ShopComponent implements OnInit, AfterViewChecked {
  pageData$: Observable<ShopPageData>;

  filterForm = new FormGroup({
    price: new FormControl('Növekvő', Validators.required)
  });
  prices = [{ price: 'Csökkenő' }, { price: 'Növekvő' }];

  first = 0;
  rows = 25;

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
              filter((products) => !!products),
              map((products) => ({
                category: 'Összes termék',
                image:
                  '../../../assets/images/landing-page/carousel-placeholder.jpg',
                products,
                priceFilter: price
              }))
            );
          case 'dream-it':
            return this.store$.select(selectCustomProducts).pipe(
              filter((products) => !!products),
              map((products) => ({
                category: '"Álmodd meg"',
                image:
                  '../../../assets/images/landing-page/carousel-placeholder.jpg',
                products,
                priceFilter: price,
                description:
                  'Ez a legizgalmasabb rész! Az "Álmodd meg" kategória különlegessége, hogy a gondosan összeválogatott kérdések és válaszok alapján teljes egészében saját magadnak tudod összeállítani a termékeket. Ha konkrét elképzeléssel érkeztél, vagy ha eszedbe jutott, hogy milyen jó lenne hasonló színvilágú termékekből álló szettet ajándékozni, akkor nagyon jó helyen jársz!'
              }))
            );
          case 'featured':
            return this.store$.select(selectFeaturedProducts).pipe(
              filter((products) => !!products),
              map((products) => ({
                category: 'Kiemelt termékek',
                image:
                  '../../../assets/images/landing-page/carousel-placeholder.jpg',
                products,
                priceFilter: price
              }))
            );

          case 'doll-dress':
            return this.store$.select(selectDollDresses).pipe(
              filter((products) => !!products),
              map((products) => ({
                category: 'Baba ruhák és kiegészítők',
                image:
                  '../../../assets/images/landing-page/carousel-placeholder.jpg',
                products,
                priceFilter: price
              }))
            );

          default:
            return this.store$.select(selectCategoryById(id)).pipe(
              filter((category) => !!category),
              map((category) => ({
                category: category.name,
                image: category.image,
                description: category.description,
                products: category.items as Product[],
                priceFilter: price
              }))
            );
        }
      }),
      map((pageData) => {
        const data: ShopPageData = { ...pageData };
        if (data.priceFilter === 'Csökkenő') {
          data.products = [...data.products].sort((a, b) => b.price - a.price);
        } else if (data.priceFilter === 'Növekvő') {
          data.products = [...data.products].sort((a, b) => a.price - b.price);
        }

        this.titleService.setTitle(`Nyuszkó Kuckó | ${data.category}`);
        this.metaService.addTags([
          {
            name: 'description',
            content: data.description
              ? data.description
              : 'Böngessz termékeim között, és rendelj egyedi, kézzel készített nyuszkókat, mackókat, nyuszkó szundikendőket, mackó szundikendőket, babákat és kiegészítőket'
          },
          {
            name: 'keywords',
            content:
              'kapcsolat, babák, nyuszi, nyuszik, nyuszkó, nyuszkók, maci, macik, mackók, szundikendő, szundikendők, kézzel készített, webshop'
          },
          {
            property: 'og:title',
            content: `Nyuszkó Kuckó | ${data.category}}`
          },
          {
            property: 'og:description',
            content: data.description
              ? data.description
              : 'Böngessz termékeim között, és rendelj egyedi, kézzel készített nyuszkókat, mackókat, nyuszkó szundikendőket, mackó szundikendőket, babákat és kiegészítőket'
          },
          {
            property: 'og:image',
            content: `${data.image}`
          },
          { name: 'robots', content: 'index, follow' },
          { name: 'author', content: 'Nyuszkó Kuckó' }
        ]);

        const page = sessionStorage.getItem('page');

        if (page) {
          this.first = Number(page);
        }

        return data;
      })
    );
  }

  ngAfterViewChecked(): void {
    sessionStorage.removeItem('page');
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
