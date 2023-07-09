import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '@core/models/user.model';

@Component({
  selector: 'mhd-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent {
  user = this.data;

  constructor(@Inject(MAT_DIALOG_DATA) public data: User) {}
}
