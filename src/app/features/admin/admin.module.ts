import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { ToolbarModule } from 'primeng/toolbar';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ImageModule } from 'primeng/image';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ReportsComponent } from './components/reports/reports.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { OrderDetailsComponent } from './components/orders/components/order-details/order-details.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { AddMaterialComponent } from './components/materials/components/add-material/add-material.component';
import { AddInspirationComponent } from './components/inspirations/components/add-inspiration/add-inspiration.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InspirationsComponent } from './components/inspirations/inspirations.component';
import { MaterialsComponent } from './components/materials/materials.component';
import { AddCategoryComponent } from './components/categories/components/add-category/add-category.component';
import { EditCategoryComponent } from './components/categories/components/edit-category/edit-category.component';
import { EditMaterialComponent } from './components/materials/components/edit-material/edit-material.component';
import { ProductsComponent } from './components/products/products.component';
import { AddProductComponent } from './components/products/components/add-product/add-product.component';
import { EditProductComponent } from './components/products/components/edit-product/edit-product.component';
import { OrdersComponent } from './components/orders/orders.component';
import { UsersComponent } from './components/users/users.component';
import { UserDetailsComponent } from './components/users/components/user-details/user-details.component';

const PRIME_NG = [
  CardModule,
  StyleClassModule,
  TableModule,
  DialogModule,
  DropdownModule,
  InputTextareaModule,
  ButtonModule,
  ToolbarModule,
  PanelModule,
  DividerModule,
  InputTextModule,
  ToggleButtonModule,
  RippleModule,
  TagModule,
  TooltipModule,
  ImageModule,
  BadgeModule
];

@NgModule({
  declarations: [
    AdminComponent,
    ReportsComponent,
    CategoriesComponent,
    EditCategoryComponent,
    OrderDetailsComponent,
    UserListComponent,
    AddMaterialComponent,
    AddInspirationComponent,
    InspirationsComponent,
    InspirationsComponent,
    MaterialsComponent,
    AddCategoryComponent,
    EditMaterialComponent,
    ProductsComponent,
    AddProductComponent,
    EditProductComponent,
    OrdersComponent,
    UsersComponent,
    UserDetailsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxSkeletonLoaderModule,
    ...PRIME_NG
  ]
})
export class AdminModule {}
