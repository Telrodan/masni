import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { AddMaterialComponent } from './components/add-material/add-material.component';
import { MaterialListComponent } from './components/material-list/material-list.component';

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
  ToggleButtonModule
];

@NgModule({
  declarations: [
    AdminComponent,
    ReportsComponent,
    ProductListComponent,
    CategoriesComponent,
    OrderDetailsComponent,
    OrderListComponent,
    AddProductComponent,
    UserListComponent,
    AddMaterialComponent,
    MaterialListComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ...PRIME_NG
  ]
})
export class AdminModule {}
