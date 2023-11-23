import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '@core/models/user.model';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'mhd-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserDetailsComponent {
  user = this.data;
  tabMenuItems: MenuItem[] = [
    {
      id: 'details',
      label: 'Adatok'
    },
    {
      id: 'addresses',
      label: 'Címek'
    },
    {
      id: 'cart',
      label: 'Kosár'
    },
    {
      id: 'orders',
      label: 'Rendelések'
    }
  ];
  activeItem: MenuItem = this.tabMenuItems[0];

  constructor(@Inject(MAT_DIALOG_DATA) public data: User) {}

  onChangeTabMenu(event: MenuItem) {
    this.activeItem = event;
    console.log(this.activeItem);
  }
}
