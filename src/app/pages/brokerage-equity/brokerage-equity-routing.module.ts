import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrokerageEquityPage } from './brokerage-equity.page';

const routes: Routes = [
  {
    path: '',
    component: BrokerageEquityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrokerageEquityPageRoutingModule {}
