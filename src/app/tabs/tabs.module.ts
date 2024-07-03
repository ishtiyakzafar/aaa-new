import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { TabsPage } from './tabs.page';
import { SharedModule } from '../components/shared.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { OrderPipe } from 'ngx-order-pipe';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    FormsModule,
    TabsPageRoutingModule,
    NgxDaterangepickerMd
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
