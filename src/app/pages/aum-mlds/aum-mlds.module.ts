import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AumMldsPageRoutingModule } from './aum-mlds-routing.module';
import { AumMldsPage } from './aum-mlds.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AumMldsPageRoutingModule
  ],
  declarations: [AumMldsPage]
})
export class AumMldsPageModule {}
