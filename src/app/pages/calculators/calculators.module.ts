import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CalculatorsPageRoutingModule } from './calculators-routing.module';
import { CalculatorsPage } from './calculators.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CalculatorsPageRoutingModule
  ],
  declarations: [CalculatorsPage]
})
export class CalculatorsPageModule {}
