import { Route } from '@angular/router';

const loginComponent = () =>
  import('./login/login.component').then((m) => m.LoginComponent);

const signupComponent = () =>
  import('./signup/signup.component').then((m) => m.SignupComponent);

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
  }
] as Route[];
