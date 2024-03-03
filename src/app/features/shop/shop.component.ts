import {
  AfterViewChecked,
  Component,
  HostBinding,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { Store } from '@ngrx/store';
import { map, switchMap, Observable, filter } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { ShopPageData } from '@core/models/shop-page-data.model';
import {
  selectAvailableProducts,
  selectCustomProducts,
  selectDollDresses,
  selectFeaturedProducts,
  selectProductCategoryWithAvailableProductsByCategoryId
} from '@core/store';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { CommonModule } from '@angular/common';

@UntilDestroy()
@Component({
  selector: 'mhd-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginatorModule, ProgressSpinnerModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShopComponent implements OnInit, AfterViewChecked {
  @HostBinding('class.nyk-shop') hostClass = true;

  pageData$: Observable<ShopPageData>;

  first = 0;
  rows = 25;

  constructor(
    private store$: Store,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    this.pageData$ = this.route.params.pipe(map((params) => params['id'])).pipe(
      switchMap((id) => {
        this.first = 0;

        switch (id) {
          case 'all':
            return this.store$.select(selectAvailableProducts).pipe(
              filter((products) => !!products),
              map((products) => ({
                category: 'Összes termék',
                image:
                  '../../../assets/images/landing-page/carousel-placeholder.jpg',
                products
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
                products
              }))
            );

          case 'doll-dress':
            return this.store$.select(selectDollDresses).pipe(
              filter((products) => !!products),
              map((products) => ({
                category: 'Baba ruhák és kiegészítők',
                image:
                  '../../../assets/images/landing-page/carousel-placeholder.jpg',
                products
              }))
            );

          default:
            return this.store$
              .select(
                selectProductCategoryWithAvailableProductsByCategoryId(id)
              )
              .pipe(
                filter((category) => !!category),
                map((category) => ({
                  category: category.name,
                  image: category.image,
                  description: category.description,
                  products: category.items
                }))
              );
        }
      }),
      map((pageData) => {
        const data: ShopPageData = { ...pageData };
        data.products = data.products.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

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

  onPageChange(event: PaginatorState): void {
    const shop = document.getElementById('shop');
    if (shop) {
      shop.scrollIntoView({ behavior: 'smooth' });
    }
    this.first = event.first;
    this.rows = event.rows;
  }
}
