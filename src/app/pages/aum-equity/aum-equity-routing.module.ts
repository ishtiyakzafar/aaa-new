import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AumEquityPage } from './aum-equity.page';

const routes: Routes = [
  {
    path: '',
    component: AumEquityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AumEquityPageRoutingModule {}
