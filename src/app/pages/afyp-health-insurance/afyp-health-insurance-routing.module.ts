import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AfypHealthInsurancePage } from './afyp-health-insurance.page';

const routes: Routes = [
  {
    path: '',
    component: AfypHealthInsurancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AfypHealthInsurancePageRoutingModule {}
