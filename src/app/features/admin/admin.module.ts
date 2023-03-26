import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AccordionModule } from 'primeng/accordion';
import { StyleClassModule } from 'primeng/styleclass';
import { DialogModule } from 'primeng/dialog';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReportsComponent } from './components/reports/reports.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ProductComponent } from './components/product/product.component';
import { AllProductComponent } from './components/all-product/all-product.component';
import { UsersComponent } from './components/users/users.component';

const PRIME_NG = [
  AccordionModule,
  StyleClassModule,
  CardModule,
  ToolbarModule,
  ButtonModule,
  TableModule,
  InputTextModule,
  InputTextareaModule,
  CheckboxModule,
  DropdownModule,
  InputNumberModule,
  DividerModule,
  ConfirmDialogModule,
  DialogModule
];

@NgModule({
  declarations: [
    DashboardComponent,
    ReportsComponent,
    CategoriesComponent,
    ProductComponent,
    AllProductComponent,
    UsersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ...PRIME_NG
  ]
})
export class AdminModule {}
