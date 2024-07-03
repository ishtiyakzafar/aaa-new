import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuestTabsPageRoutingModule } from './guest-guest-tabs-routing.module';
import { GuestTabsPage } from './guest-tabs.page';
import { SharedModule } from '../../components/shared.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    FormsModule,
    GuestTabsPageRoutingModule,
    NgxDaterangepickerMd
  ],
  declarations: [GuestTabsPage]
})
export class GuestTabsPageModule {}
