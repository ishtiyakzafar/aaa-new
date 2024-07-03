import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../login/login.service';
import { IonicModule } from '@ionic/angular';
import { ViewReportListPageRoutingModule } from './view-report-list-routing.module';
import { ViewReportListPage } from './view-report-list.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ViewReportListPageRoutingModule,
  ],
  declarations: [ViewReportListPage],providers:[LoginService]

})
export class ViewReportListPageModule {}
