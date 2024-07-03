import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FutOiGainerLoserPageRoutingModule } from './fut-oi-gainer-loser-routing.module';
import { FutOiGainerLoserPage } from './fut-oi-gainer-loser.page';
import { ModalModule } from '../../components/modal/modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalModule,
    FutOiGainerLoserPageRoutingModule
  ],
  declarations: [FutOiGainerLoserPage], 
  exports: [FutOiGainerLoserPage]
})
export class FutOiGainerLoserPageModule {}
