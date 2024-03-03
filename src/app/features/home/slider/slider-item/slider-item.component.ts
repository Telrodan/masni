import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderItem } from '@core/models/slider-item.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'nyk-slider-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './slider-item.component.html',
  styleUrls: ['./slider-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SliderItemComponent {
  @HostBinding('class.nyk-slider-item') hostClass = true;

  @Input() slide: SliderItem;
}
