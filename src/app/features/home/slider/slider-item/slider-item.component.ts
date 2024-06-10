import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ButtonComponent } from '@shared/button/button.component';
import { SliderItem } from '../slider.component';

@Component({
    selector: 'nyk-slider-item',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, ButtonComponent],
    templateUrl: './slider-item.component.html',
    styleUrls: ['./slider-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class SliderItemComponent {
    @HostBinding('class.nyk-slider-item') hostClass = true;

    @Input() slide: SliderItem;
}
