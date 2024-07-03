import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DashboardRevampPageRoutingModule } from './dashboard-routing.module';

import { DashboardRevampPage } from './dashboard.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    DashboardRevampPageRoutingModule
  ],
  declarations: [DashboardRevampPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardRevampPageModule {}
