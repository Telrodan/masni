import { ChangeDetectorRef, Component, HostBinding } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { catchError, switchMap, take, tap } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { ToastrService } from '@core/services/toastr.service';
import { Title, Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ResetPasswordData } from '@core/models/auth-data.model';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
    selector: 'nyk-reset-password',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        PasswordModule,
        SpinnerComponent
    ],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
    @HostBinding('class') hostClass = 'nyk-reset-password';

    resetPasswordForm = this.fb.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
        passwordConfirm: ['', [Validators.required, Validators.minLength(8)]]
    });

    resetToken: string;
    isLoading = false;

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private router: Router,
        private titleService: Title,
        private metaService: Meta,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.titleService.setTitle('Nyuszkó Kuckó | Új jelszó');
        this.metaService.addTags([
            {
                name: 'description',
                content: 'Új jelszó beállítása.'
            },
            {
                name: 'keywords',
                content:
                    'új jelszó beállítása, elfelejtett jelszó, babák, nyuszi, nyuszik, nyuszkó, nyuszkók, maci, macik, mackók, szundikendő, szundikendők, kézzel készített, webshop'
            },
            {
                property: 'og:title',
                content: 'Nyuszkó Kuckó | Új jelszó'
            },
            {
                property: 'og:description',
                content: 'Új jelszó beállítása.'
            },
            {
                property: 'og:image',
                content: 'https://nyuszkokucko.hu/assets/images/nyuszko-kucko-logo.png'
            },
            { name: 'robots', content: 'index, follow' },
            { name: 'author', content: 'Nyuszkó Kuckó' }
        ]);
    }

    isFormFieldValid(form: FormGroup, controllerName: string): boolean {
        return (
            form.get(`${controllerName}`).invalid &&
            form.get(`${controllerName}`).touched &&
            form.get(`${controllerName}`).dirty
        );
    }

    arePasswordsMatches(): boolean {
        return (
            this.resetPasswordForm.get('passwordConfirm').dirty &&
            this.resetPasswordForm.get('password').value !==
                this.resetPasswordForm.get('passwordConfirm').value
        );
    }

    onSubmit() {
        if (this.resetPasswordForm.valid) {
            this.isLoading = true;
            this.route.params
                .pipe(
                    take(1),
                    switchMap((params: { passwordResetToken: string }) => {
                        const { password, passwordConfirm } = this.resetPasswordForm.value;
                        const { passwordResetToken } = params;
                        const resetPasswordData: ResetPasswordData = {
                            password,
                            passwordConfirm,
                            passwordResetToken
                        };

                        return this.authService.resetPassword$(resetPasswordData).pipe(
                            tap(() => {
                                this.toastr.success('Új jelszó sikeresen beállítva');
                                this.router.navigate(['/']);
                            }),
                            catchError(() => {
                                this.isLoading = false;
                                this.changeDetectorRef.detectChanges();

                                return [];
                            })
                        );
                    })
                )
                .subscribe();
        }
    }
}
