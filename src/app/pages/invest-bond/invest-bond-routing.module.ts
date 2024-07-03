import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvestBondPage } from './invest-bond.page';

const routes: Routes = [
  {
    path: '',
    component: InvestBondPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvestBondPageRoutingModule {}
