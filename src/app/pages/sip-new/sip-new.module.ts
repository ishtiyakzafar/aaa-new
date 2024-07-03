import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SipNewPageRoutingModule } from './sip-new-routing.module';
import { SipNewPage } from './sip-new.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SipNewPageRoutingModule
  ],
  declarations: [SipNewPage]
})
export class SipNewPageModule {}
