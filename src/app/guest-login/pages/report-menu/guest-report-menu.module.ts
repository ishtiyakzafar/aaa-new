import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GuestReportMenuComponentRoutingModule } from './guest-report-menu-routing.module';
import { GuestReportMenuComponent } from './guest-report-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuestReportMenuComponentRoutingModule
  ],
  declarations: [GuestReportMenuComponent]
})
export class GuestReportMenuModule { }
