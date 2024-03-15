import { Route } from '@angular/router';

const loginComponent = () =>
    import('./login/login.component').then((m) => m.LoginComponent);

const signupComponent = () =>
    import('./signup/signup.component').then((m) => m.SignupComponent);

const forgotPasswordComponent = () =>
    import('./forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
    );

const resetPasswordComponent = () =>
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
        loadComponent: signupComponent
    },
    {
        path: 'login',
        loadComponent: loginComponent
    },
    {
        path: 'forgot-password',
        loadComponent: forgotPasswordComponent
    },
    {
        path: 'reset-password/:token',
        loadComponent: resetPasswordComponent
    }
] as Route[];
