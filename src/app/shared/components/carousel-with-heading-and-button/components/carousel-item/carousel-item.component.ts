import { Component, Input } from '@angular/core';

@Component({
  selector: 'mhd-carousel-item',
  templateUrl: './carousel-item.component.html',
  styleUrls: ['./carousel-item.component.scss']
})
export class CarouselItemComponent {
  @Input() imageSrc: string;
  @Input() isRoundImage: boolean;

  isImageLoading = true;

  imageLoaded(): void {
    this.isImageLoading = false;
  }
}
