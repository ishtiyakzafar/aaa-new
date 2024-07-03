import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CircularsMenuComponentRoutingModule } from './circulars-menu-routing.module';
import { CircularsMenuComponent } from './circulars-menu.component';
//import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    //AngularMyDatePickerModule,
    NgxDaterangepickerMd.forRoot(),
    CircularsMenuComponentRoutingModule
  ],
  declarations: [CircularsMenuComponent]
})
export class CircularsMenuModule { }