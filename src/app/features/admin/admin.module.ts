import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AccordionModule } from 'primeng/accordion';
import { StyleClassModule } from 'primeng/styleclass';
import { ReportsComponent } from './components/reports/reports.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from './components/product/product.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { AllProductComponent } from './components/all-product/all-product.component';

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
  FormsModule,
  FileUploadModule,
  ReactiveFormsModule,
  DividerModule
];

@NgModule({
  declarations: [
    DashboardComponent,
    ReportsComponent,
    CategoriesComponent,
    ProductComponent,
    AllProductComponent
  ],
  imports: [CommonModule, FormsModule, AdminRoutingModule, ...PRIME_NG]
})
export class AdminModule {}
