import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrokerageMutualFundPage } from './brokerage-mutual-fund.page';

const routes: Routes = [
  {
    path: '',
    component: BrokerageMutualFundPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrokerageMutualFundPageRoutingModule {}
