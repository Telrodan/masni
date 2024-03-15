import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { filter, map, Observable, Subject, switchMap, tap } from 'rxjs';

import { User } from '@core/models/user.model';
import { ToastrService } from '@core/services/toastr.service';
import { UserService } from '@core/services/user.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { Table } from 'primeng/table';
import { UserDetailsComponent } from './components/user-details/user-details.component';

@Component({
    selector: 'mhd-users',
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
        private toastr: ToastrService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        // this.users$ = this.store.select(selectUsers).pipe(
        //   filter((users) => !!users),
        //   map((users) => [...users])
        // );

        this.selectedUser$ = this.selectedUserSubject.pipe(
            filter((user) => !!user)
        );
    }

    applyFilterGlobal($event: any, stringVal: string, table: Table): void {
        const filter = ($event.target as HTMLInputElement).value;

        table.filterGlobal(filter, stringVal);
    }

    onUserDetails(user: User): void {
        this.dialog.open(UserDetailsComponent, {
            minWidth: '50vw',
            maxWidth: '50vw',
            data: user
        });
    }

    onDeleteUser(user: User): void {
        this.dialog
            .open(ConfirmDialogComponent, {
                minWidth: '40vw',
                data: {
                    message: `Biztos törölni szeretnéd ${user.name} felhasználót, ${user.id} azonosítóval?`
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
