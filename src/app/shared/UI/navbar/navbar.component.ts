import { Component } from '@angular/core';

import {
  faChevronDown,
  faCartShopping,
  faHouse,
  faShop,
  faPalette,
  faPhone,
  faUser,
  faUserPlus,
  faRightToBracket
} from '@fortawesome/free-solid-svg-icons';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'masni-handmade-dolls-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  public faChevronDown = faChevronDown;
  public faCartShopping = faCartShopping;
  public faBars = faBars;
  public faXmark = faXmark;
  public faHouse = faHouse;
  public faShop = faShop;
  public faPalette = faPalette;
  public faPhone = faPhone;
  public faUser = faUser;
  public faUserPlus = faUserPlus;
  public faRightToBracket = faRightToBracket;

  public closeNabar() {
    document.getElementsByClassName('sidebar')[0].classList.add('hidden');
  }
}
