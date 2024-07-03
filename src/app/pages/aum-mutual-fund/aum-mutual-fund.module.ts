import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AumMutualFundPageRoutingModule } from './aum-mutual-fund-routing.module';
import { AumMutualFundPage } from './aum-mutual-fund.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    AumMutualFundPageRoutingModule
  ],
  declarations: [AumMutualFundPage]
})
export class AumMutualFundPageModule {}
