import { Route } from '@angular/router';

const SigninComponent = () => import('./signin/signin.component').then((m) => m.SigninComponent);

const SignupComponent = () => import('./signup/signup.component').then((m) => m.SignupComponent);

const ForgotPasswordComponent = () =>
    import('./forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent);

const ResetPasswordComponent = () =>
    import('./reset-password/reset-password.component').then((m) => m.ResetPasswordComponent);

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
        path: 'signin',
        loadComponent: SigninComponent
    },
    {
        path: 'forgot-password',
        loadComponent: ForgotPasswordComponent
    },
    {
        path: 'reset-password/:passwordResetToken',
        loadComponent: ResetPasswordComponent
    }
] as Route[];
