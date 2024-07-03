import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BrokerageModificationPageRoutingModule } from './brokerage-modification-routing.module';
import { BrokerageModificationPage } from './brokerage-modification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrokerageModificationPageRoutingModule
  ],
  declarations: [BrokerageModificationPage]
})
export class BrokerageModificationPageModule {}
