import { Component, OnInit } from '@angular/core';
import { User } from '@core/models/user.model';
import { UserService } from '@core/services/user.service';
import { usersSelector } from '@core/store/selectors/user.selector';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { concatMap, filter, Observable, Subject, tap } from 'rxjs';

interface UsersData {
  users: User[];
  selectedUser: User;
}

@UntilDestroy()
@Component({
  selector: 'masni-handmade-dolls-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users$: Observable<User[]>;
  isDialogVisible = false;
  selectedUser$: Observable<User>;
  private selectedUserSubject = new Subject<User>();

  constructor(
    private userService: UserService,
    private store: Store,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.users$ = this.userService.getAllUsers$().pipe(
      concatMap(() => this.store.select(usersSelector)),
      filter((users) => !!users),
      untilDestroyed(this)
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
    this.confirmationService.confirm({
      message: `Biztos törölni szeretnéd ${user.name} felhasználót, ${user.email} címmel?`,
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      accept: () => {
        this.userService
          .deleteUser$(user)
          .pipe(
            tap(() => {
              this.messageService.add({
                severity: 'success',
                summary: 'Siker!',
                detail: `${user.name} törölve`
              });
            })
          )
          .subscribe();
      }
    });
  }
}
