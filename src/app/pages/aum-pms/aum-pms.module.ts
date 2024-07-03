import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AumPmsPageRoutingModule } from './aum-pms-routing.module';
import { AumPmsPage } from './aum-pms.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AumPmsPageRoutingModule
  ],
  declarations: [AumPmsPage]
})
export class AumPmsPageModule {}
