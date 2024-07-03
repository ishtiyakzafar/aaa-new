import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientListPageRoutingModule } from './client-list-routing.module';

import { ClientListPage } from './client-list.page';
// import { Ng2SearchPipeModule } from 'ng2-search-filter';   review
// import { OrderModule } from 'ngx-order-pipe';              review
import { SharedModule } from '../../components/shared.module';
import { CustomFilterPipe } from '../../helpers/custom-filter.pipe';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientListPageRoutingModule,
    // Ng2SearchPipeModule,  review. getting error
    // OrderModule,   review. getting error
    SharedModule
  ],
  exports: [CustomFilterPipe],
  declarations: [ClientListPage]
})
export class ClientListPageModule {}
