import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AumMutualFundPage } from './aum-mutual-fund.page';

const routes: Routes = [
  {
    path: '',
    component: AumMutualFundPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AumMutualFundPageRoutingModule {}
