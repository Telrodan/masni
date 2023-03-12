import { Component, Input } from '@angular/core';

@Component({
  selector: 'masni-handmade-dolls-image-composition',
  templateUrl: './image-composition.component.html',
  styleUrls: ['./image-composition.component.scss']
})
export class ImageCompositionComponent {
  @Input() public images: string[];
  public hoveredImageUrl: string;

  public selectedImageIndex = 0;
}
