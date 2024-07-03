import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageCustomMappingPageRoutingModule } from './manage-custom-mapping-routing.module';

import { ManageCustomMappingPage } from './manage-custom-mapping';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageCustomMappingPageRoutingModule
  ],
  declarations: [ManageCustomMappingPage]
})
export class ManageCustomMappingPageModule {}
