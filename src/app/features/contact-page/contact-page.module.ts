import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactPageRoutingModule } from './contact-page-routing.module';
import { ContactPageComponent } from './contact-page.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [ContactPageComponent],
  imports: [CommonModule, ContactPageRoutingModule, SharedModule]
})
export class ContactPageModule {}
