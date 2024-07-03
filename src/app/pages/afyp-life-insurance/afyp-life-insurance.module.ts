import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AfypLifeInsurancePageRoutingModule } from './afyp-life-insurance-routing.module';
import { AfypLifeInsurancePage } from './afyp-life-insurance.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AfypLifeInsurancePageRoutingModule
  ],
  declarations: [AfypLifeInsurancePage]
})
export class AfypLifeInsurancePageModule {}
