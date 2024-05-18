/* eslint-disable no-useless-escape */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { catchError, tap } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

import { AuthService } from '@core/services/auth.service';
import { ToastrService } from '@core/services/toastr.service';
import { emailRegex } from '@shared/util/email-regex';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
    selector: 'nyk-forgot-password',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        RouterModule,
        ButtonModule,
        SpinnerComponent
    ],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent {
    @HostBinding('class') hostClass = 'nyk-forgot-password';

    forgotPasswordForm = this.fb.group({
        email: ['', [Validators.required, Validators.pattern(emailRegex)]]
    });

    isLoading = false;
    isEmailSent = false;

    constructor(
        private authService: AuthService,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private titleService: Title,
        private metaService: Meta,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.titleService.setTitle('Nyuszkó Kuckó | Elfelejtett jelszó');
        this.metaService.addTags([
            {
                name: 'description',
                content: 'Elfelejtett jelszó.'
            },
            {
                name: 'keywords',
                content:
                    'új jelszó kérése, elfelejtett jelszó, babák, nyuszi, nyuszik, nyuszkó, nyuszkók, maci, macik, mackók, szundikendő, szundikendők, kézzel készített, webshop'
            },
            {
                property: 'og:title',
                content: 'Nyuszkó Kuckó | Elfelejtett jelszó'
            },
            {
                property: 'og:description',
                content: 'Elfelejtett jelszó.'
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

    onSubmit(): void {
        if (this.forgotPasswordForm.valid) {
            const email = this.forgotPasswordForm.value.email.trim();
            this.isLoading = true;

            this.authService
                .forgotPassword$(email)
                .pipe(
                    tap(() => {
                        this.isEmailSent = true;
                        this.isLoading = false;
                        this.toastr.success(
                            'Ha van egyezés ezzel az email címmel, akkor hamarosan megérkezik az új jelszó beállító email.'
                        );
                        this.changeDetectorRef.detectChanges();
                    }),
                    catchError(() => {
                        this.isLoading = false;
                        this.changeDetectorRef.detectChanges();

                        return [];
                    })
                )
                .subscribe();
        }
    }
}
