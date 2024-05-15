import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    Renderer2,
    ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';

import { NavbarComponent } from './navbar/navbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { FooterComponent } from './footer/footer.component';
import { ShoppingCartComponent } from '@features/shopping-cart/shopping-cart.component';

@Component({
    selector: 'nyk-layout',
    standalone: true,
    imports: [
        CommonModule,
        MatSidenavModule,
        SidenavComponent,
        NavbarComponent,
        FooterComponent,
        ShoppingCartComponent
    ],
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class LayoutComponent {
    @HostBinding('class.nyk-layout') hostClass = true;

    @HostBinding('class.nyk-layout-admin')
    @Input()
    isAdminPage = false;

    isSidenavOpen = false;
    isShoppingCartOpen = false;

    constructor(private renderer: Renderer2) {}

    toggleSidenav(): void {
        this.isSidenavOpen = !this.isSidenavOpen;
    }

    toggleShoppingCart(): void {
        this.isShoppingCartOpen = !this.isShoppingCartOpen;
        if (this.isShoppingCartOpen) {
            this.renderer.addClass(document.body, 'scroll-locked');
        } else {
            this.renderer.removeClass(document.body, 'scroll-locked');
        }
    }
}
