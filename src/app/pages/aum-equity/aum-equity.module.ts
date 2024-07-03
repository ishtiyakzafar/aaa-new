import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AumEquityPageRoutingModule } from './aum-equity-routing.module';

import { AumEquityPage } from './aum-equity.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AumEquityPageRoutingModule
  ],
  declarations: [AumEquityPage]
})
export class AumEquityPageModule {}