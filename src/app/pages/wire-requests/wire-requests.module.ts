import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WireRequestsPageRoutingModule } from './wire-requests-routing.module';
import { WireRequestsPage } from './wire-requests.page';
import { SharedModule } from '../../components/shared.module';
import { FundTransferPageModule } from '../fund-transfer/fund-transfer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WireRequestsPageRoutingModule,
    SharedModule,
    FundTransferPageModule
  ],
  declarations: [WireRequestsPage]
})
export class WireRequestsPageModule {}
