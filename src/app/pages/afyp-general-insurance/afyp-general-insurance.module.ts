import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AfypGeneralInsurancePageRoutingModule } from './afyp-general-insurance-routing.module';
import { AfypGeneralInsurancePage } from './afyp-general-insurance.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AfypGeneralInsurancePageRoutingModule
  ],
  declarations: [AfypGeneralInsurancePage]
})
export class AfypGeneralInsurancePageModule {}
