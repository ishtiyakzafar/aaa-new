import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClientDetailsPageRoutingModule } from './client-details-routing.module';
import { ClientDetailsPage } from './client-details.page';
import { clientsTabsModule } from '../clients-tabs/clients-tabs.module';
import { SharedModule } from '../../components/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    ClientDetailsPageRoutingModule,
    clientsTabsModule
  ],
  declarations: [ClientDetailsPage]
})
export class ClientDetailsPageModule {}
