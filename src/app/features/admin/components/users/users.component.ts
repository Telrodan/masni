import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { concatMap, filter, Observable, Subject, switchMap, tap } from 'rxjs';

import { User } from '@core/models/user.model';
import { ToastrService } from '@core/services/toastr.service';
import { UserService } from '@core/services/user.service';
import { usersSelector } from '@core/store/selectors/user.selector';
import { ConfirmDialogComponent } from 'src/app/shared/UI/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'masni-handmade-dolls-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users$: Observable<User[]>;
  selectedUser$: Observable<User>;
  isDialogVisible = false;
  private selectedUserSubject = new Subject<User>();

  constructor(
    private userService: UserService,
    private store: Store,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.users$ = this.userService.getAllUsers$().pipe(
      concatMap(() => this.store.select(usersSelector)),
      filter((users) => !!users)
    );

    this.selectedUser$ = this.selectedUserSubject.pipe(
      filter((user) => !!user)
    );
  }

  onUserDetails(user: User): void {
    this.isDialogVisible = true;
    this.selectedUserSubject.next(user);
  }

  onDeleteUser(user: User): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Megerősítés',
          message: `Biztos törölni szeretnéd ${user.name} felhasználót, ${user.email} címmel?`,
          confirmButtonText: 'Igen',
          cancelButtonText: 'Nem'
        }
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => !!confirmed),
        switchMap(() => this.userService.deleteUser$(user)),
        tap(() => {
          this.toastr.success('Siker', `${user.name} törölve`);
        })
      )
      .subscribe();
  }
}
