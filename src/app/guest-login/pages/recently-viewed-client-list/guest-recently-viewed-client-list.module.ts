import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuestRecentlyViewedClientListPageRoutingModule } from './guest-recently-viewed-client-list-routing.module';

import { GuestRecentlyViewedClientListPage } from './guest-recently-viewed-client-list.page';
import { CodeInputModule } from 'angular-code-input';
import { SharedModule } from '../../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    GuestRecentlyViewedClientListPageRoutingModule,
    CodeInputModule
  ],
  declarations: [GuestRecentlyViewedClientListPage]
})
export class GuestRecentlyViewedClientListPageModule {}
