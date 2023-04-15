import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { AccordionModule } from 'primeng/accordion';

import { NyuszkoShopRoutingModule } from './nyuszko-shop-routing.module';
import { NyuszkoShopComponent } from './nyuszko-shop.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NyuszkoBuilderComponent } from './components/nyuszko-builder/nyuszko-builder.component';
import { NyuszkoSzundikendoBuilderComponent } from './components/nyuszko-szundikendo-builder/nyuszko-szundikendo-builder.component';
import { MackoBuilderComponent } from './components/macko-builder/macko-builder.component';
import { MackoSzundikendoBuilderComponent } from './components/macko-szundikendo-builder/macko-szundikendo-builder.component';
import { ButtonModule } from 'primeng/button';

const PRIME_NG = [
  DropdownModule,
  CheckboxModule,
  InputTextareaModule,
  InputTextModule,
  AccordionModule,
  ButtonModule
];

@NgModule({
  declarations: [
    NyuszkoShopComponent,
    NyuszkoBuilderComponent,
    NyuszkoSzundikendoBuilderComponent,
    MackoBuilderComponent,
    MackoSzundikendoBuilderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NyuszkoShopRoutingModule,
    FontAwesomeModule,
    ...PRIME_NG
  ]
})
export class NyuszkoShopModule {}
