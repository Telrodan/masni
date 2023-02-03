import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'masni-handmade-dolls-carousel-with-heading-and-button',
  templateUrl: './carousel-with-heading-and-button.component.html',
  styleUrls: ['./carousel-with-heading-and-button.component.scss']
})
export class CarouselWithHeadingAndButtonComponent implements OnInit {
  @Input() public heading: string;
  @Input() public displayHeading: boolean;
  @Input() public data: string[];
  @Input() public linkText: string;
  @Input() public linkRoute: string;
  @Input() public displayLink: boolean;

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

  public ngOnInit(): void {}
}
