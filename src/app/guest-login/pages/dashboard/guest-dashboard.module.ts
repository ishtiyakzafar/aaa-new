import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { GuestDashboardRevampPageRoutingModule } from './guest-dashboard-routing.module';

import { GuestDashboardRevampPage } from './guest-dashboard.page';
import { SharedModule } from '../../../components/shared.module';
import { GuestHavingBirthdayModalComponent } from '../../components/having-birthday-modal/guest-having-birthday-modal.component';
import { GuestNotInvestInSipComponent } from '../../components/not-invest-in-sip/guest-not-invest-in-sip.component';
import { GuestPmsAifLeadComponent } from '../../components/pms-aif-lead/guest-pms-aif-lead.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    GuestDashboardRevampPageRoutingModule,
    GuestHavingBirthdayModalComponent,
    GuestNotInvestInSipComponent,
    GuestPmsAifLeadComponent
  ],
  declarations: [GuestDashboardRevampPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GusetDashboardRevampPageModule {}
