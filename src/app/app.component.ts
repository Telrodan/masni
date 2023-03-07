import { Component, OnInit } from '@angular/core';

import { Carousel } from 'primeng/carousel';

import { AuthService } from './core/services/auth.service';
import { MaterialService } from './core/services/material.service';

@Component({
  selector: 'masni-handmade-dolls-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private materialService: MaterialService
  ) {
    // Allows user to scroll on carousel(mobile scroll issue fix)
    Carousel.prototype.onTouchMove = () => {};
  }

  public ngOnInit(): void {
    this.materialService.getMaterialsStore();
    this.authService.autoAuthentication();
  }
}
