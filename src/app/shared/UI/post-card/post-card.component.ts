import { Component, Input } from '@angular/core';

import { faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { News } from 'src/app/core/models/news.model';

@Component({
  selector: 'masni-handmade-dolls-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent {
  @Input() public postData: News | undefined;

  public faShareNodes = faShareNodes;
}
