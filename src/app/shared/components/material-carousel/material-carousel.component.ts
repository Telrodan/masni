import { Component, Input } from '@angular/core';
import { Material } from '@core/store/material/material.model';

@Component({
    selector: 'mhd-material-carousel',
    templateUrl: './material-carousel.component.html',
    styleUrls: ['./material-carousel.component.scss']
})
export class MaterialCarouselComponent {
    @Input() materials: Material[];

    imageLoadedStatus: boolean[] = [];

    responsiveOptions = [
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    imageLoaded(index: number) {
        this.imageLoadedStatus[index] = true;
    }
}
