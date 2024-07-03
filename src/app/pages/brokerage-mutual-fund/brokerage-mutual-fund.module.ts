import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BrokerageMutualFundPageRoutingModule } from './brokerage-mutual-fund-routing.module';
import { BrokerageMutualFundPage } from './brokerage-mutual-fund.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    BrokerageMutualFundPageRoutingModule
  ],
  declarations: [BrokerageMutualFundPage]
})
export class BrokerageMutualFundPageModule {}
