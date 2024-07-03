import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RolloverDeliveryPageRoutingModule } from './rollover-delivery-routing.module';
import { RolloverDeliveryPage } from './rollover-delivery.page';
import { ModalModule } from '../../components/modal/modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalModule,
    RolloverDeliveryPageRoutingModule
  ],
  declarations: [RolloverDeliveryPage],
  exports: [RolloverDeliveryPage]
})
export class RolloverDeliveryPageModule {}
