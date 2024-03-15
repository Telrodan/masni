import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormControlName,
    FormGroup,
    Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { User } from '@core/models/user.model';
import { AuthService } from '@core/services/auth.service';
import { ToastrService } from '@core/services/toastr.service';
import { UserService } from '@core/services/user.service';
import { filter, Observable, tap, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'mhd-user-profile',
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
        private userService: UserService,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private authService: AuthService
    ) {}

    ngOnInit(): void {}

    onSubmit(): void {
        if (this.form.dirty && this.form.valid) {
            this.userService
                .updateCurrentUser$(this.form.value)
                .pipe(
                    tap(() => {
                        this.toastr.success('Adatok módosítva');
                    })
                )
                .subscribe();
        }
    }

    onChangePassword(
        newPassword: string,
        newPasswordConfirm: string,
        oldPassword: string
    ) {
        const passwordObj = {
            passwordCurrent: oldPassword,
            password: newPassword,
            passwordConfirm: newPasswordConfirm
        };

        this.userService
            .updateCurrentUserPassword$(passwordObj)
            .pipe(tap(() => this.toastr.success('Jelszó módosítva')))
            .subscribe();
    }

    onDeleteCurrentUser(user: User): void {
        this.dialog
            .open(ConfirmDialogComponent, {
                data: {
                    message: `Biztos törölni szeretnéd a fiókod, ${user.email} címmel?`
                }
            })
            .afterClosed()
            .pipe(
                filter((confirmed) => !!confirmed),
                switchMap(() => this.userService.deleteCurrentUser$()),
                tap(() => {
                    this.toastr.success(`${user.name} törölve`);
                    this.authService.logout();
                })
            )
            .subscribe();
    }

    private initForm(user: User): void {
        this.form = new FormGroup({
            name: new FormControl(user.name, Validators.required),
            phone: new FormControl(user.phone, Validators.required),
            shippingAddress: new FormGroup({
                street: new FormControl(
                    user.shippingAddress.street,
                    Validators.required
                ),
                city: new FormControl(
                    user.shippingAddress.city,
                    Validators.required
                ),
                postcode: new FormControl(
                    user.shippingAddress.postcode,
                    Validators.required
                ),
                county: new FormControl(
                    user.shippingAddress.county,
                    Validators.required
                )
            }),
            billingAddress: new FormGroup({
                street: new FormControl(
                    user.billingAddress.street,
                    Validators.required
                ),
                city: new FormControl(
                    user.billingAddress.city,
                    Validators.required
                ),
                postcode: new FormControl(
                    user.billingAddress.postcode,
                    Validators.required
                ),
                county: new FormControl(
                    user.billingAddress.county,
                    Validators.required
                )
            }),

            subscribed: new FormControl(user.subscribed, Validators.required)
        });
    }
}
