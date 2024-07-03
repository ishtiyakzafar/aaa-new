import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvestBondPageRoutingModule } from './invest-bond-routing.module';

import { InvestBondPage } from './invest-bond.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvestBondPageRoutingModule
  ],
  declarations: [InvestBondPage]
})
export class InvestBondPageModule {}
