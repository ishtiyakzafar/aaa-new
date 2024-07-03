import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BulkBlockDealsPageRoutingModule } from './bulk-block-deals-routing.module';
import { BulkBlockDealsPage } from './bulk-block-deals.page';
import { ModalModule } from '../../components/modal/modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BulkBlockDealsPageRoutingModule,
    ModalModule
  ],
  declarations: [BulkBlockDealsPage],
  exports: [BulkBlockDealsPage]
})
export class BulkBlockDealsPageModule {}
