import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarketsPage } from './markets.page';
import { MarketsPageRoutingModule } from './markets-routing.module';
import { NumberFormatPipe } from '../../components/pipes.module';
import { SharedModule } from '../../components/shared.module';
import { GainersLosersPageModule } from '../../components/gainers-losers/gainers-losers.module';
import { BulkBlockDealsPageModule } from '../../components/bulk-block-deals/bulk-block-deals.module';
import { WeekHlPageModule } from '../../components/week-hl/week-hl.module';
import { VolToppersPageModule } from '../../components/vol-toppers/vol-toppers.module';
import { FutOiGainerLoserPageModule } from '../fut-oi-gainer-loser/fut-oi-gainer-loser.module';
import { FutGainerLoserPageModule } from '../fut-gainer-loser/fut-gainer-loser.module';
import { RolloverDeliveryPageModule } from '../rollover-delivery/rollover-delivery.module';
import { PremiumDiscountPageModule } from '../premium-discount/premium-discount.module';
import { MostActiveStockIndexPageModule } from '../most-active-stock-index/most-active-stock-index.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MarketsPageRoutingModule,
    GainersLosersPageModule,
    WeekHlPageModule,
    VolToppersPageModule,
    BulkBlockDealsPageModule,
    FutGainerLoserPageModule,
    FutOiGainerLoserPageModule,
    RolloverDeliveryPageModule,
    PremiumDiscountPageModule,
    MostActiveStockIndexPageModule,
    NumberFormatPipe
  ],
  declarations: [MarketsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MarketsPageModule {}
