import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrokerageModificationPage } from './brokerage-modification.page';

const routes: Routes = [
  {
    path: '',
    component: BrokerageModificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrokerageModificationPageRoutingModule {}
