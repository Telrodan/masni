import { Component, OnInit } from '@angular/core';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'masni-handmade-dolls-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  public ngOnInit(): void {
    this.authService.autoAuthentication();
  }
}
