import { Component, Input } from '@angular/core';

@Component({
  selector: 'mhd-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {
  @Input() images: string[] = [];

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 8,
      numScroll: 3
    },
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
}
