import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReportMenuComponentRoutingModule } from './report-menu-routing.module';
import { ReportMenuComponent } from './report-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportMenuComponentRoutingModule
  ],
  declarations: [ReportMenuComponent]
})
export class ReportMenuModule { }
