import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SipCeasedPageRoutingModule } from './sip-ceased-routing.module';
import { SipCeasedPage } from './sip-ceased.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SipCeasedPageRoutingModule
  ],
  declarations: [SipCeasedPage]
})
export class SipCeasedPageModule {}
