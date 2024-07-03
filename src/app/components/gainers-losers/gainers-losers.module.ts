import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GainersLosersPageRoutingModule } from './gainers-losers-routing.module';
import { GainersLosersPage } from './gainers-losers.page';
import { ModalModule } from '../../components/modal/modal.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GainersLosersPageRoutingModule,
    ModalModule
  ],
  declarations: [GainersLosersPage],
  exports: [GainersLosersPage]
})
export class GainersLosersPageModule {}
