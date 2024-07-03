import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WeekHlPageRoutingModule } from './week-hl-routing.module';
import { WeekHlPage } from './week-hl.page';
import { ModalModule } from '../../components/modal/modal.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WeekHlPageRoutingModule,
    ModalModule
  ],
  declarations: [WeekHlPage],
  exports: [WeekHlPage]
})
export class WeekHlPageModule {}
