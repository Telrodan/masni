import { Component, OnInit } from '@angular/core';
import { Carousel } from 'primeng/carousel';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'masni-handmade-dolls-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    Carousel.prototype.onTouchMove = () => {};
  }

  public ngOnInit(): void {
    this.authService.autoAuthentication();
  }
}
