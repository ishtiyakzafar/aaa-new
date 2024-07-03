import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FundTransferPage } from './fund-transfer.page';

const routes: Routes = [
  {
    path: '',
    component: FundTransferPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FundTransferPageRoutingModule {}
