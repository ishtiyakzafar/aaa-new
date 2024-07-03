import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SipLivePageRoutingModule } from './sip-live-routing.module';
import { SipLivePage } from './sip-live.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SipLivePageRoutingModule
  ],
  declarations: [SipLivePage]
})
export class SipLivePageModule {}
