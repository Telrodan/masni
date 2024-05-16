import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    ViewEncapsulation
} from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { catchError, tap } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

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
        SpinnerComponent,
        ButtonModule
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
    togglePasswordButtonIcon = 'pi-eye';

    constructor(
        private authService: AuthService,
        private changeDetectorRef: ChangeDetectorRef,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private router: Router,
        private titleService: Title,
        private metaService: Meta
    ) {
        this.titleService.setTitle('Belépés | Nyuszkó Kuckó');
        this.metaService.addTags([
            {
                name: 'description',
                content: 'Belépés az oldalra'
            },
            {
                name: 'keywords',
                content:
                    'belépés, elfelejtett jelszó, babák, nyuszi, nyuszik, nyuszkó, nyuszkók, maci, macik, mackók, szundikendő, szundikendők, kézzel készített, webshop'
            },
            {
                property: 'og:title',
                content: 'Belépés | Nyuszkó Kuckó'
            },
            {
                property: 'og:description',
                content: 'Belépés az oldalra'
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

    onTogglePasswordVisibility(): void {
        const passwordInput = document.getElementById('password') as HTMLInputElement;

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }

        this.isPasswordVisible = !this.isPasswordVisible;
        this.togglePasswordButtonIcon = this.isPasswordVisible ? 'pi-eye-slash' : 'pi-eye';
    }

    onLogin(): void {
        this.isLoading = true;

        const authData: AuthData = {
            email: this.loginForm.value.email.trim(),
            password: this.loginForm.value.password.trim()
        };

        this.authService
            .login$(authData)
            .pipe(
                tap(() => {
                    this.isLoading = false;
                    this.router.navigate(['/']);
                    this.toastr.success('Sikeres belépés, átirányítva a főoldalra');
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
