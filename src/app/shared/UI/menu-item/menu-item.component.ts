import { Component, Input } from '@angular/core';

interface MenuItemData {
  name: string;
  linkSrc: string;
  backgroundImage: string;
}

@Component({
  selector: 'mhd-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent {
  @Input() public menuItemData!: MenuItemData;
}
