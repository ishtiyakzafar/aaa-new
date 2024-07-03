import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FutGainerLoserPageRoutingModule } from './fut-gainer-loser-routing.module';
import { FutGainerLoserPage } from './fut-gainer-loser.page';
import { ModalModule } from '../../components/modal/modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalModule,
    FutGainerLoserPageRoutingModule
  ],
  declarations: [FutGainerLoserPage],
  exports: [FutGainerLoserPage]
})
export class FutGainerLoserPageModule {}
