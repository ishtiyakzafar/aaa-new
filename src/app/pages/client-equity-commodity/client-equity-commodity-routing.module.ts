import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientEquityCommodityPage } from './client-equity-commodity.page';

const routes: Routes = [
  {
    path: '',
    component: ClientEquityCommodityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientEquityCommodityPageRoutingModule {}
