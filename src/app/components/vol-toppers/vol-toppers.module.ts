import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VolToppersPageRoutingModule } from './vol-toppers-routing.module';

import { VolToppersPage } from './vol-toppers.page';
import { ModalModule } from '../../components/modal/modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VolToppersPageRoutingModule,
    ModalModule
  ],
  declarations: [VolToppersPage],
  exports: [VolToppersPage]

})
export class VolToppersPageModule {}
