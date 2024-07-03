import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FolioWisePageRoutingModule } from './folio-wise-routing.module';
import { FolioWisePage } from './folio-wise.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    FolioWisePageRoutingModule,
  ],
  declarations: [FolioWisePage], providers: []

})
export class FolioWisePageModule { }
