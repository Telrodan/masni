import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Subscription, catchError, filter, switchMap, tap } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';

import { ToastrService } from '@core/services/toastr.service';
import { AuthService } from '@core/services/auth.service';
import { AuthData } from '@core/models/auth-data.model';
import { emailRegex } from '@shared/util/email-regex';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
    selector: 'nyk-signin',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        InputTextModule,
        SpinnerComponent,
        ButtonModule,
        PasswordModule,
        GoogleSigninButtonModule
    ],
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigninComponent implements OnInit, OnDestroy {
    @HostBinding('class') hostClass = 'nyk-signin';

    signinForm = this.fb.group({
        email: ['', [Validators.required, Validators.pattern(emailRegex)]],
        password: ['', [Validators.required, Validators.minLength(8)]]
    });

    isLoading = false;

    private authSubscription$$: Subscription;

    constructor(
        private authService: AuthService,
        private changeDetectorRef: ChangeDetectorRef,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private router: Router,
        private titleService: Title,
        private metaService: Meta,
        private socialAuthService: SocialAuthService
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

    ngOnInit(): void {
        this.authSubscription$$ = this.socialAuthService.authState
            .pipe(
                filter((user) => !!user.idToken),
                switchMap((user) =>
                    this.authService.google$(user.idToken).pipe(
                        tap(() => {
                            this.toastr.success('Belépés sikeres, átirányítva a főoldalra.');
                            this.router.navigate(['/']);
                        })
                    )
                )
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        this.authSubscription$$.unsubscribe();
    }

    isFormFieldValid(form: FormGroup, controllerName: string): boolean {
        return (
            form.get(`${controllerName}`).invalid &&
            form.get(`${controllerName}`).touched &&
            form.get(`${controllerName}`).dirty
        );
    }

    onSignin(): void {
        this.isLoading = true;

        const authData: AuthData = {
            ...(this.signinForm.value as AuthData)
        };

        this.authService
            .signin$(authData)
            .pipe(
                tap(() => {
                    this.isLoading = false;
                    this.router.navigate(['/']);
                    this.toastr.success('Sikeres belépés, átirányítva a főoldalra.');
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
