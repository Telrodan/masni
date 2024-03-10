import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'nyk-product-details-gallery',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './product-details-gallery.component.html',
    styleUrls: ['./product-details-gallery.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsGalleryComponent {
    @HostBinding('class.nyk-gallery') hostClass = true;

    @Input() images: string[];

    activeImage = 0;

    onImageClick(index: number) {
        this.activeImage = index;
    }
}
