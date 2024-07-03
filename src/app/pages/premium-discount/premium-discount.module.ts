import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PremiumDiscountPageRoutingModule } from './premium-discount-routing.module';
import { PremiumDiscountPage } from './premium-discount.page';
import { ModalModule } from '../../components/modal/modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalModule,
    PremiumDiscountPageRoutingModule
  ],
  declarations: [PremiumDiscountPage],
  exports: [PremiumDiscountPage]
})
export class PremiumDiscountPageModule {}
