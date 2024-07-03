import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PartnerCodePageRoutingModule } from './partner-code-routing.module';
import { PartnerCodePage } from './partner-code.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PartnerCodePageRoutingModule,
    SharedModule
  ],
  declarations: [PartnerCodePage]
})
export class PartnerCodePageModule {}
