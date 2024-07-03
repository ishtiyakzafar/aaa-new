import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FundTransferPageRoutingModule } from './fund-transfer-routing.module';
import { FundTransferPage } from './fund-transfer.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    FundTransferPageRoutingModule
  ],
  declarations: [FundTransferPage],
  exports : [FundTransferPage]
})
export class FundTransferPageModule {}
