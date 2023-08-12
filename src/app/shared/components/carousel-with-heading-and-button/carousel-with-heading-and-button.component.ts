import { Component, Input } from '@angular/core';

export interface CarouselData {
  heading: string;
  displayHeading: boolean;
  images: string[];
  isRoundImage: boolean;
  linkText: string;
  linkRoute: string;
  displayLink: boolean;
}

@Component({
  selector: 'mhd-carousel-with-heading-and-button',
  templateUrl: './carousel-with-heading-and-button.component.html',
  styleUrls: ['./carousel-with-heading-and-button.component.scss']
})
export class CarouselWithHeadingAndButtonComponent {
  @Input() carouselData: CarouselData;

  isImageLoading = true;

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
}
