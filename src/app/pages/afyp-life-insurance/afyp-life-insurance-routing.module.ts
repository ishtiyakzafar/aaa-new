import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AfypLifeInsurancePage } from './afyp-life-insurance.page';

const routes: Routes = [
  {
    path: '',
    component: AfypLifeInsurancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AfypLifeInsurancePageRoutingModule {}
