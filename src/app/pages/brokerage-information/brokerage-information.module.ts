import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BrokerageInformationPageRoutingModule } from './brokerage-information-routing.module';
import { BrokerageInformationPage } from './brokerage-information.page';
import { DpSchemeDetailsComponent } from '../dp-scheme-details/dp-scheme-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrokerageInformationPageRoutingModule
  ],
  declarations: [BrokerageInformationPage,DpSchemeDetailsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BrokerageInformationPageModule {}
