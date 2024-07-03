import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShareReportsPageRoutingModule } from './share-reports-routing.module';
import { ShareReportsPage } from './share-reports.page';
import { SharedModule } from '../../components/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ShareReportsPageRoutingModule,
  ],
  declarations: [ShareReportsPage]
})
export class ShareReportsPageModule {}
