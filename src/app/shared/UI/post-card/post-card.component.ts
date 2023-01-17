import { Component } from '@angular/core';

import { faShareNodes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'masni-handmade-dolls-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent {
  public faShareNodes = faShareNodes;
}
