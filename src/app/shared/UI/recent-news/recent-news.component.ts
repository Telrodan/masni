import { Component, Input } from '@angular/core';
import { News } from 'src/app/core/models/news.model';

@Component({
  selector: 'masni-handmade-dolls-recent-news',
  templateUrl: './recent-news.component.html',
  styleUrls: ['./recent-news.component.scss']
})
export class RecentNewsComponent {
  @Input() public recentNews: News[] = [];
}
