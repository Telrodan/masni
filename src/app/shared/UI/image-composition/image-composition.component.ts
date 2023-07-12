import { Component, Input } from '@angular/core';

@Component({
  selector: 'mhd-image-composition',
  templateUrl: './image-composition.component.html',
  styleUrls: ['./image-composition.component.scss']
})
export class ImageCompositionComponent {
  @Input() public images: string[];
  public selectedImageIndex = 0;
}
