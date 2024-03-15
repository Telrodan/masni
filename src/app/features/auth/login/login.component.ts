import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    ViewEncapsulation
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { catchError, tap } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';

import { ToastrService } from '@core/services/toastr.service';
import { AuthService } from '@core/services/auth.service';
import { AuthData } from '@core/models/auth-data.model';
import { emailRegex } from '@shared/util/email-regex';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
    selector: 'nyk-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        InputTextModule,
        SpinnerComponent
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
    @HostBinding('class') hostClass = 'nyk-login';

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.pattern(emailRegex)]],
        password: ['', [Validators.required, Validators.minLength(8)]]
    });
    isPasswordVisible = false;
    isLoading = false;

    constructor(
        private authService: AuthService,
        private changeDetectorRef: ChangeDetectorRef,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private router: Router,
        private titleService: Title,
        private metaService: Meta
    ) {
        this.titleService.setTitle('Nyuszkó Kuckó | Belépés');
        this.metaService.addTags([
            {
                name: 'description',
                content: 'Belépés az oldalra.'
            },
            {
                name: 'keywords',
                content:
                    'belépés, elfelejtett jelszó, babák, nyuszi, nyuszik, nyuszkó, nyuszkók, maci, macik, mackók, szundikendő, szundikendők, kézzel készített, webshop'
            },
            {
                property: 'og:title',
                content: 'Nyuszkó Kuckó | Belépés'
            },
            {
                property: 'og:description',
                content: 'Belépés az oldalra.'
            },
            {
                property: 'og:image',
                content:
                    'https://nyuszkokucko.hu/assets/images/nyuszko-kucko-logo.png'
            },
            { name: 'robots', content: 'index, follow' },
            { name: 'author', content: 'Nyuszkó Kuckó' }
        ]);
    }

    onTogglePasswordVisibility(): void {
        const passwordInput = document.getElementById(
            'password'
        ) as HTMLInputElement;
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }

        this.isPasswordVisible = !this.isPasswordVisible;
    }

    onLogin(): void {
        if (this.loginForm.valid) {
            this.isLoading = true;

            const authData: AuthData = {
                email: this.loginForm.value.email.trim(),
                password: this.loginForm.value.password.trim()
            };

            this.authService
                .login$(authData)
                .pipe(
                    tap(() => {
                        this.toastr.success(
                            'Sikeres belépés, átirányítva a főoldra'
                        );
                        this.loginForm.reset();
                        this.router.navigate(['/']);
                        this.isLoading = false;
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
