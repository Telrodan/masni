import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    OnChanges,
    SimpleChange,
    ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import { SliderItemComponent } from './slider-item/slider-item.component';
import { ProductCategory } from '@core/store/category/category.model';

export interface SliderItem {
    label: string;
    image: string;
    fromPrice: number;
    routerLink: string;
}

@Component({
    selector: 'nyk-slider',
    standalone: true,
    imports: [CommonModule, CarouselModule, SliderItemComponent],
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class SliderComponent {
    @HostBinding('class.nyk-slider') hostClass = true;

    @Input() slides: SliderItem[];

    customOptions: OwlOptions = {
        loop: true,
        autoplay: true,
        autoplayTimeout: 10000,
        autoplayHoverPause: false,
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
                items: 1
            },
            740: {
                items: 1
            }
        },
        nav: true
    };

    trackByLabel(index: number, item: SliderItem) {
        return item.label;
    }
}
