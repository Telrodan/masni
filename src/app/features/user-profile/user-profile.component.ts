import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { User } from '@core/models/user.model';
import { userSelector } from '@core/store';
import { Store } from '@ngrx/store';
import { filter, Observable } from 'rxjs';

@Component({
  selector: 'masni-handmade-dolls-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(300, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class UserProfileComponent {
  activeMenu = 'profile';
  user$: Observable<User>;

  constructor(private store: Store) {
    this.user$ = this.store.select(userSelector).pipe(filter((user) => !!user));
  }
}
