import { Category } from '@core/models/category.model';
import { NavbarMenuItem } from '@core/models/navbar-menu-item.model';

export interface CategoryState {
    categories: Category[];
    navbarMenu: NavbarMenuItem[];
    isBusy: boolean;
}
