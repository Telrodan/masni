import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit
} from '@angular/core';

@Component({
  selector: 'mhd-scrollable-image-with-title',
  templateUrl: './scrollable-image-with-title.component.html',
  styleUrls: ['./scrollable-image-with-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollableImageWithTitleComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() imageUrl: string;
  @Input() elementToScrollTo: HTMLElement;

  linearGradient = 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))';
  backgroundImage: string;

  ngOnInit(): void {
    this.backgroundImage =
      this.linearGradient + ', url("' + this.imageUrl + '")';

    console.log('this.backgroundImage', this.backgroundImage);
  }

  ngOnChanges(): void {
    this.backgroundImage =
      this.linearGradient + ', url("' + this.imageUrl + '")';
  }

  scrollToElement(): void {
    this.elementToScrollTo.scrollIntoView({ behavior: 'smooth' });
  }
}
