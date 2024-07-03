import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuestTab3Page } from './guest-invest';
import { GuestTab3PageRoutingModule } from './guest-invest-routing.module'
import { SharedModule } from '../../../components/shared.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: GuestTab3Page }]),
    GuestTab3PageRoutingModule,
    SharedModule
  ],
  declarations: [GuestTab3Page],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GuestInvestModule {}
