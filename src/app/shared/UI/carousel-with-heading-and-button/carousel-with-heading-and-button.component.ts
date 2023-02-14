import { Component, Input, OnInit } from '@angular/core';

interface CarouselData {
  heading: string;
  displayHeading: boolean;
  images: string[];
  isRoundImage: boolean;
  linkText: string;
  linkRoute: string;
  displayLink: boolean;
}

@Component({
  selector: 'masni-handmade-dolls-carousel-with-heading-and-button',
  templateUrl: './carousel-with-heading-and-button.component.html',
  styleUrls: ['./carousel-with-heading-and-button.component.scss']
})
export class CarouselWithHeadingAndButtonComponent implements OnInit {
  @Input() public carouselData: CarouselData;
  public images: string[];

  public ngOnInit(): void {
    this.images = this.carouselData.images;
  }

  public responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
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
