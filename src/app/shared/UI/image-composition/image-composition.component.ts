import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'masni-handmade-dolls-image-composition',
  templateUrl: './image-composition.component.html',
  styleUrls: ['./image-composition.component.scss']
})
export class ImageCompositionComponent {
  @Input() public images: string[];
  productImagesUrl = environment.productImagesUrl;
  public selectedImageIndex = 0;
}
