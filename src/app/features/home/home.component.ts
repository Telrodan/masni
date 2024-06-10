import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    OnInit,
    ViewEncapsulation,
    inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

import { Store, select } from '@ngrx/store';
import { Observable, map, startWith, switchMap } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';

import { CategoriesComponent, ProductSubCategoriesData } from './categories/categories.component';
import { ProductService } from '@core/services/product.service';
import { SliderComponent, SliderItem } from './slider/slider.component';
import { ProductsCarouselComponent } from './products-carousel/products-carousel.component';
import { DreamItCtaComponent } from './dream-it-cta/dream-it-cta.component';
import { ProductCategory } from '@core/store/category/category.model';
import { Product } from '@core/store/product/product.model';
import { CategorySelector } from '@core/store/category';
import { ProductSelector } from '@core/store/product';

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
        DreamItCtaComponent,
        ProductsCarouselComponent,
        SkeletonModule
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
    @HostBinding('class.nyk-home') hostClass = true;

    sliderItems$: Observable<SliderItem[]>;
    productSubCategoriesData$: Observable<ProductSubCategoriesData[]>;
    sortedProducts$: Observable<SortedProducts[]>;

    private readonly store = inject(Store);
    private readonly titleService = inject(Title);
    private readonly metaService = inject(Meta);

    constructor() {
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
        // this.sliderItems$ = this.store.select(CategorySelector.selectMainProductCategories()).pipe(
        //     map((categories) =>
        //         categories
        //             // .filter((category) => category.subCategories.length > 0)
        //             .map((category) => ({
        //                 label: category.name,
        //                 image: category.image,
        //                 // fromPrice: this.findLowestPrice(category.subCategories),
        //                 routerLink: `/shop/${category.id}`
        //             }))
        //     )
        // );

        this.productSubCategoriesData$ = this.store
            .select(CategorySelector.selectProductSubCategories())
            .pipe(
                map((categories) =>
                    categories
                        .filter((category) => category.items.length > 0)
                        .map((category) => ({
                            label: category.name,
                            image: category.image,
                            routerLink: `/shop/${category.id}`,
                            count: category.items.length
                        }))
                )
            );

        this.sortedProducts$ = this.store.select(ProductSelector.selectProducts()).pipe(
            map((products) => [
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
            ])
        );
    }

    trackByTitle(index: number, SortedProducts: SortedProducts): string {
        return SortedProducts.title;
    }

    private findLowestPrice(subCategories: ProductCategory[]): number {
        return subCategories.reduce((minPrice, category) => {
            return category.items.reduce((currentMin, product) => {
                return Math.min(currentMin, product.price);
            }, minPrice);
        }, Infinity);
    }
}
