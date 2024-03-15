import { Route } from '@angular/router';

const LoginComponent = () =>
    import('./login/login.component').then((m) => m.LoginComponent);

const SignupComponent = () =>
    import('./signup/signup.component').then((m) => m.SignupComponent);

const ForgotPasswordComponent = () =>
    import('./forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
    );

const ResetPasswordComponent = () =>
    import('./reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
    );

export default [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'signup',
        loadComponent: SignupComponent
    },
    {
        path: 'login',
        loadComponent: LoginComponent
    },
    {
        path: 'forgot-password',
        loadComponent: ForgotPasswordComponent
    },
    {
        path: 'reset-password/:token',
        loadComponent: ResetPasswordComponent
    }
] as Route[];
