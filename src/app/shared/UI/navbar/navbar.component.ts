import { Component, HostListener, OnInit } from '@angular/core';
import {
  animate,
  style,
  transition,
  trigger,
  state
} from '@angular/animations';

import {
  faChevronDown,
  faCartShopping
} from '@fortawesome/free-solid-svg-icons';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

import { isMobileView } from '../../utils/mobile-view-treshold';

@Component({
  selector: 'masni-handmade-dolls-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('slideInAndOutAnimation', [
      state('false', style({ right: '-100%' })),
      state('true', style({ right: '0' })),
      transition('false => true', animate('0.3s ease-in')),
      transition('true => false', animate('0.3s ease-in'))
    ])
  ]
})
export class NavbarComponent implements OnInit {
  public isNavbarOpen = false;
  public isMobileView = false;

  public faChevronDown = faChevronDown;
  public faCartShopping = faCartShopping;
  public faBars = faBars;
  public faXmark = faXmark;

  public ngOnInit(): void {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  public onResize(): void {
    this.isMobileView = isMobileView();
  }

  public toggleNavbar(): void {
    if (this.isMobileView) {
      this.isNavbarOpen = !this.isNavbarOpen;
      document.body.style.overflowY = this.isNavbarOpen ? 'hidden' : 'scroll';
    }
  }
}
