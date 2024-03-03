import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

import { Observable, startWith, switchMap, tap } from 'rxjs';

import { CategoryService } from '@core/services/category.service';
import { CategoriesComponent } from './categories/categories.component';
import { Product } from '@core/models/product.model';
import { ProductCategory } from '@core/models/category.model';
import { ProductService } from '@core/services/product.service';
import { SliderComponent } from './slider/slider.component';
import { ProductsCarouselComponent } from './products-carousel/products-carousel.component';

interface SortedProducts {
  title: string;
  products: Product[];
  routerLink: string;
  image: string;
}

@Component({
  selector: 'nyk-home',
  standalone: true,
  imports: [
    CommonModule,
    SliderComponent,
    CategoriesComponent,
    ProductsCarouselComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  @HostBinding('class.nyk-home') hostClass = true;

  productCategories$: Observable<ProductCategory[]>;
  sortedProducts: SortedProducts[];

  private likeProduct = new EventEmitter<Product>();

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private changeDetectorRef: ChangeDetectorRef,
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
          'babák, nyuszi, nyuszik, nyuszkó, nyuszkók, maci, macik, mackók, szundikendő, szundikendők, kézzel készített, webshop, plüss, plüssfigura, plüssfigurák, ajándék, ajándékok, ajándéktárgy, ajándéktárgyak, ajándékbolt'
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
    this.productCategories$ = this.categoryService.getProductCategories$();

    this.likeProduct
      .pipe(
        startWith(null),
        switchMap(() =>
          this.productService.getProducts$().pipe(
            tap((products) => {
              this.sortedProducts = [
                {
                  title: 'Kiemelt termékek',
                  products: products.filter((product) => product.isFeatured),
                  routerLink: '/shop/featured',
                  image: '../../../assets/images/home-page-decoration-1.png'
                },
                {
                  title: 'Álmodd meg',
                  products: products.filter((product) => product.isCustom),
                  routerLink: '/shop/dream-it',
                  image: '../../../assets/images/home-page-decoration-2.png'
                },
                {
                  title: 'Összes termék',
                  products: products,
                  routerLink: '/shop/all',
                  image: '../../../assets/images/home-page-decoration-3.png'
                }
              ];
              this.changeDetectorRef.markForCheck();
            })
          )
        )
      )
      .subscribe();
  }

  trackByTitle(index: number, SortedProducts: SortedProducts): string {
    return SortedProducts.title;
  }

  onLikeProduct() {
    this.likeProduct.emit();
  }
}