import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AfypHealthInsurancePageRoutingModule } from './afyp-health-insurance-routing.module';
import { AfypHealthInsurancePage } from './afyp-health-insurance.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AfypHealthInsurancePageRoutingModule
  ],
  declarations: [AfypHealthInsurancePage]
})
export class AfypHealthInsurancePageModule {}
