import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RaiseQueryPageRoutingModule } from './raise-query-routing.module';
import { RaiseQueryComponent } from './raise-query.component';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RaiseQueryPageRoutingModule
  ],
  declarations: [RaiseQueryComponent]
})
export class RaiseQueryPageModule {}
