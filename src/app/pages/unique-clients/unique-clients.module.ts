import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UniqueClientsPageRoutingModule } from './unique-clients-routing.module';

import { UniqueClientsPage } from './unique-clients.page';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    UniqueClientsPageRoutingModule
  ],
  declarations: [UniqueClientsPage]
})
export class UniqueClientsPageModule {}
