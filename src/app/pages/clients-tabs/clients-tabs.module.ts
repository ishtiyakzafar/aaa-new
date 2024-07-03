import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { clientTabsPageRoutingModule } from './clients-tabs-routing.module';

import { ClientTabsPage } from './clients-tabs';
import { SharedModule } from '../../components/shared.module';
import { NumberFormatPipe } from '../../components/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    clientTabsPageRoutingModule,
    SharedModule,
    NumberFormatPipe 
  ],
  declarations: [ClientTabsPage],
  exports: [ClientTabsPage]
})
export class clientsTabsModule {}
