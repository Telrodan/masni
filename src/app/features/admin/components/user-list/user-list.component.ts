import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { filter, Observable, Subject, switchMap, tap } from 'rxjs';

import { User } from '@core/models/user.model';
import { ToastrService } from '@core/services/toastr.service';
import { UserService } from '@core/services/user.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'mhd-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
    users$: Observable<User[]>;
    selectedUser$: Observable<User>;
    isDialogVisible = false;

    private selectedUserSubject = new Subject<User>();

    constructor(
        private userService: UserService,
        private toastr: ToastrService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        // this.users$ = this.store.select(selectUsers);

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
                    message: `Biztos törölni szeretnéd ${user.name} felhasználót, ${user.email} címmel?`
                }
            })
            .afterClosed()
            .pipe(
                filter((confirmed) => !!confirmed),
                switchMap(() => this.userService.deleteUser$(user)),
                tap(() => {
                    this.toastr.success(`${user.name} törölve`);
                })
            )
            .subscribe();
    }
}
