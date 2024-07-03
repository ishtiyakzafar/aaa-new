import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AumFdPageRoutingModule } from './aum-fd-routing.module';
import { AumFdPage } from './aum-fd.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AumFdPageRoutingModule
  ],
  declarations: [AumFdPage]
})
export class AumFdPageModule {}
