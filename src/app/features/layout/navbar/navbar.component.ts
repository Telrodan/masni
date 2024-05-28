import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    OnInit,
    Output,
    ViewEncapsulation,
    inject
} from '@angular/core';

import { Observable, tap } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MessageService } from 'primeng/api';

import { AuthService } from '@core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { NavbarMenuItem } from '@core/models/navbar-menu-item.model';
import { Store } from '@ngrx/store';
import { CategorySelector } from '@core/store/category';

@UntilDestroy({ checkProperties: true })
@Component({
    selector: 'nyk-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule, StyleClassModule, MatSidenavModule, MatMenuModule],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {
    @HostBinding('class.nyk-navbar') hostClass = true;

    @Output() sidenavStateChange = new EventEmitter<void>();
    @Output() shoppingCartStateChange = new EventEmitter<void>();

    navbarMenu$: Observable<NavbarMenuItem[]>;
    isAuthenticated$: Observable<boolean>;
    itemCounter$: Observable<string>;

    isSearchBarOpen = false;
    isProductsMenuOpen = false;

    isAdmin = false;

    private readonly store = inject(Store);

    constructor(private authService: AuthService, private messageService: MessageService) {
        this.navbarMenu$ = this.store.select(CategorySelector.selectNavbarMenu());
    }

    ngOnInit(): void {
        this.isAuthenticated$ = this.authService.getAuthStatus$().pipe(
            tap(() => {
                this.isAdmin = this.authService.isAdmin();
            })
        );
    }

    toggleSidenav(): void {
        this.sidenavStateChange.emit();
    }

    toggleShoppingCart(): void {
        this.shoppingCartStateChange.emit();
    }

    toggleSearchBar(): void {
        this.isSearchBarOpen = !this.isSearchBarOpen;
    }

    onLogout(): void {
        this.authService.logout();
        this.messageService.add({
            severity: 'success',
            summary: 'Siker!',
            detail: 'Sikeres kilépés, átirányítva a főoldalra'
        });
    }
}
