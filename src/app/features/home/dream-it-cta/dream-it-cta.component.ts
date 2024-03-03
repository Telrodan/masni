import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'nyk-dream-it-cta',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dream-it-cta.component.html',
  styleUrls: ['./dream-it-cta.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DreamItCtaComponent {
  @HostBinding('class.nyk-dream-it-cta') hostClass = true;
}
