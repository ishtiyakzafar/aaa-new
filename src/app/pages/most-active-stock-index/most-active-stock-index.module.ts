import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MostActiveStockIndexPageRoutingModule } from './most-active-stock-index-routing.module';
import { MostActiveStockIndexPage } from './most-active-stock-index.page';
import { ModalModule } from '../../components/modal/modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalModule,
    MostActiveStockIndexPageRoutingModule
  ],
  declarations: [MostActiveStockIndexPage],
  exports: [MostActiveStockIndexPage]
})
export class MostActiveStockIndexPageModule {}
