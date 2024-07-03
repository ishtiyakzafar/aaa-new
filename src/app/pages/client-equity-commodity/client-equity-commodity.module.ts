import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClientEquityCommodityPageRoutingModule } from './client-equity-commodity-routing.module';
import { ClientEquityCommodityPage } from './client-equity-commodity.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ClientEquityCommodityPageRoutingModule
  ],
  declarations: [ClientEquityCommodityPage]
})
export class ClientEquityCommodityPageModule {}
