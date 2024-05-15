import { Component, HostBinding } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap, tap } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { ToastrService } from '@core/services/toastr.service';
import { Title, Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ResetPasswordData } from '@core/models/auth-data.model';

@Component({
    selector: 'nyk-reset-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule],
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

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private router: Router,
        private titleService: Title,
        private metaService: Meta
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

    onSubmit() {
        if (this.resetPasswordForm.valid) {
            this.route.params
                .pipe(
                    switchMap((params) => {
                        const resetPasswordData: ResetPasswordData = {
                            password: this.resetPasswordForm.value.password,
                            passwordConfirm: this.resetPasswordForm.value.passwordConfirm,
                            resetToken: params['token']
                        };

                        return this.authService.resetPassword$(resetPasswordData).pipe(
                            tap(() => {
                                this.toastr.success('Új jelszó sikeresen beállítva');
                                this.router.navigate(['/']);
                            })
                        );
                    })
                )
                .subscribe();
        }
    }
}
