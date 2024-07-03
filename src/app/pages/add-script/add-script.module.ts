import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddScriptPageRoutingModule } from './add-script-routing.module';

import { AddScriptPage } from './add-script.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddScriptPageRoutingModule,
    SharedModule
  ],
  declarations: [AddScriptPage]
})
export class AddScriptPageModule {}
