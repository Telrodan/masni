import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { HasRoleGuard } from '@core/guards/has-role.guard';

const homeComponent = () =>
    import('./features/home/home.component').then((c) => c.HomeComponent);

const authComponentRoutes = () => import('./features/auth/auth-routing');

const shopComponentRoutes = () => import('./features/shop/shop-routing');

const adminComponentRoutes = () => import('./features/admin/admin-routing');

const userModule = () =>
    import('./features/user/user.module').then((m) => m.UserModule);

const materialPageModule = () =>
    import('./features/material-page/material-page.module').then(
        (m) => m.MaterialPageModule
    );

const inspirationPageModule = () =>
    import('./features/inspiration-page/inspiration-page.module').then(
        (m) => m.InspirationPageModule
    );

const contactPageModule = () =>
    import('./features/contact-page/contact-page.module').then(
        (m) => m.ContactPageModule
    );

const legalModule = () =>
    import('./features/legal/legal.module').then((m) => m.LegalModule);

const orderSuccessPageModule = () =>
    import('./features/order-success-page/order-success-page.module').then(
        (m) => m.OrderSuccessPageModule
    );

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: homeComponent,
        data: { animation: 'HomePage' }
    },
    {
        path: 'admin',
        loadChildren: adminComponentRoutes,
        canActivate: [HasRoleGuard],
        data: { role: 'admin', animation: 'AdminPage' }
    },
    {
        path: 'shop',
        loadChildren: shopComponentRoutes,
        data: { animation: 'ShopPage' }
    },
    {
        path: 'auth',
        loadChildren: authComponentRoutes,
        data: { animation: 'AuthPage' }
    },
    {
        path: 'user',
        loadChildren: userModule,
        data: { animation: 'UserPage' }
    },
    {
        path: 'material',
        loadChildren: materialPageModule,
        data: { animation: 'MaterialPage' }
    },
    {
        path: 'inspiration',
        loadChildren: inspirationPageModule,
        data: { animation: 'InspirationPage' }
    },
    {
        path: 'contact',
        loadChildren: contactPageModule,
        data: { animation: 'ContactPage' }
    },
    {
        path: 'legal',
        loadChildren: legalModule,
        data: { animation: 'LegalPage' }
    },
    {
        path: 'order-success',
        loadChildren: orderSuccessPageModule
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'enabled'
        })
    ],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {}
