import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormControlName,
  FormGroup,
  Validators
} from '@angular/forms';
import { User } from '@core/models/user.model';
import { ToastrService } from '@core/services/toastr.service';
import { UserService } from '@core/services/user.service';
import { userSelector } from '@core/store';
import { Store } from '@ngrx/store';
import { filter, Observable, tap } from 'rxjs';

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
export class UserProfileComponent implements OnInit {
  activeMenu = 'profile';
  user$: Observable<User>;
  form: FormGroup;

  constructor(
    private store: Store,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.user$ = this.store.select(userSelector).pipe(
      filter((user) => !!user),
      tap((user) => {
        this.initForm(user);
      })
    );
  }

  onSubmit(): void {
    if (this.form.dirty && this.form.valid) {
      this.userService
        .updateCurrentUser$(this.form.value)
        .pipe(
          tap(() => {
            this.toastr.success('Siker', 'Adatok módosítva');
          })
        )
        .subscribe();
    }
  }

  private initForm(user: User): void {
    this.form = new FormGroup({
      name: new FormControl(user.name, Validators.required),
      phone: new FormControl(user.phone, Validators.required),
      address: new FormGroup({
        street: new FormControl(user.address.street, Validators.required),
        city: new FormControl(user.address.city, Validators.required),
        postcode: new FormControl(user.address.postcode, Validators.required),
        county: new FormControl(user.address.county, Validators.required)
      })
    });
  }
}
