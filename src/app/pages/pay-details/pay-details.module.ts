import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PayDetailsPageRoutingModule } from './pay-details-routing.module';
import { PayDetailsPage } from './pay-details.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PayDetailsPageRoutingModule
  ],
  declarations: [PayDetailsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PayDetailsPageModule {}
