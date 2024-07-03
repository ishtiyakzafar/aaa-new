import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BrokerageEquityPageRoutingModule } from './brokerage-equity-routing.module';
import { BrokerageEquityPage } from './brokerage-equity.page';
import { SharedModule } from '../../components/shared.module';
import { OrderPipe } from 'ngx-order-pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    BrokerageEquityPageRoutingModule
  ],
  declarations: [BrokerageEquityPage]
})
export class BrokerageEquityPageModule {}
