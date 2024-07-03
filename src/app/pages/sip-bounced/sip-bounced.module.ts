import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SipBouncedPageRoutingModule } from './sip-bounced-routing.module';
import { SipBouncedPage } from './sip-bounced.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SipBouncedPageRoutingModule
  ],
  declarations: [SipBouncedPage]
})
export class SipBouncedPageModule {}
