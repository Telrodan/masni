import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    ViewEncapsulation
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import { ProductCardComponent } from '@shared/product-card/product-card.component';
import { Product } from '@core/store/product/product.model';
import { ButtonComponent } from '@shared/button/button.component';

@Component({
    selector: 'nyk-products-carousel',
    standalone: true,
    imports: [CommonModule, RouterModule, CarouselModule, ProductCardComponent, ButtonComponent],
    templateUrl: './products-carousel.component.html',
    styleUrls: ['./products-carousel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsCarouselComponent {
    @HostBinding('class.nyk-products-carousel') hostClass = true;

    @Input() title: string;
    @Input() products: Product[];
    @Input() routerLink: string;

    customOptions: OwlOptions = {
        loop: true,
        autoplay: true,
        autoplayTimeout: 10000,
        autoplayHoverPause: true,
        autoplaySpeed: 1000,
        touchDrag: true,
        pullDrag: true,
        dots: false,
        navSpeed: 1000,
        navText: ['<i class="pi pi-chevron-left"></i>', '<i class="pi pi-chevron-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            400: {
                items: 2
            },
            740: {
                items: 3
            }
        },
        nav: true
    };

    trackById(index: number, product: Product) {
        return product.id;
    }
}
