import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GuestMarketsPage } from './guest-markets.page';
import { GuestMarketsPageRoutingModule } from './guest-markets-routing.module';
import { NumberFormatPipe } from '../../../components/pipes.module';
import { SharedModule } from '../../../components/shared.module';
import { GainersLosersPageModule } from '../../../components/gainers-losers/gainers-losers.module';
import { BulkBlockDealsPageModule } from '../../../components/bulk-block-deals/bulk-block-deals.module';
import { WeekHlPageModule } from '../../../components/week-hl/week-hl.module';
import { VolToppersPageModule } from '../../../components/vol-toppers/vol-toppers.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    GuestMarketsPageRoutingModule,
    GainersLosersPageModule,
    WeekHlPageModule,
    VolToppersPageModule,
    BulkBlockDealsPageModule,
    NumberFormatPipe
  ],
  declarations: [GuestMarketsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GuestMarketsPageModule {}
