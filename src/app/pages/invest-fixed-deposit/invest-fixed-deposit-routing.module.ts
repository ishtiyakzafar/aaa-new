import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvestFixedDepositPage } from './invest-fixed-deposit.page';

const routes: Routes = [
  {
    path: '',
    component: InvestFixedDepositPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvestFixedDepositPageRoutingModule {}
