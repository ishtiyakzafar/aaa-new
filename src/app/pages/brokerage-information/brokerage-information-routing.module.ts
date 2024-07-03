import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrokerageInformationPage } from './brokerage-information.page';

const routes: Routes = [
  {
    path: '',
    component: BrokerageInformationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrokerageInformationPageRoutingModule {}
