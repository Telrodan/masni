import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mhd-scrollable-image-with-title',
  templateUrl: './scrollable-image-with-title.component.html',
  styleUrls: ['./scrollable-image-with-title.component.scss']
})
export class ScrollableImageWithTitleComponent implements OnInit {
  @Input() title: string;
  @Input() imageUrl: string;
  @Input() elementToScrollTo: HTMLElement;

  linearGradient = 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))';
  backgroundImage: string;

  ngOnInit(): void {
    this.backgroundImage =
      this.linearGradient + ', url("' + this.imageUrl + '")';
  }

  scrollToElement(): void {
    this.elementToScrollTo.scrollIntoView({ behavior: 'smooth' });
  }
}
