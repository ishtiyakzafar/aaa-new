import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvestFixedDepositPageRoutingModule } from './invest-fixed-deposit-routing.module';

import { InvestFixedDepositPage } from './invest-fixed-deposit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvestFixedDepositPageRoutingModule
  ],
  declarations: [InvestFixedDepositPage]
})
export class InvestFixedDepositPageModule {}
