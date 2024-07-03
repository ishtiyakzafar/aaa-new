import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AfypGeneralInsurancePage } from './afyp-general-insurance.page';

const routes: Routes = [
  {
    path: '',
    component: AfypGeneralInsurancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AfypGeneralInsurancePageRoutingModule {}
