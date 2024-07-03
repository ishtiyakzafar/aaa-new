import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecentlyViewedClientListPageRoutingModule } from './recently-viewed-client-list-routing.module';

import { RecentlyViewedClientListPage } from './recently-viewed-client-list.page';
import { CodeInputModule } from 'angular-code-input';
import { SharedModule } from '../../components/shared.module';
import { clientsTabsModule } from '../clients-tabs/clients-tabs.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RecentlyViewedClientListPageRoutingModule,
    clientsTabsModule,
    CodeInputModule
  ],
  declarations: [RecentlyViewedClientListPage]
})
export class RecentlyViewedClientListPageModule {}
