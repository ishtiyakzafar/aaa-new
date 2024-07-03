import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GainersLosersPage } from './gainers-losers.page';

const routes: Routes = [
  {
    path: '',
    component: GainersLosersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GainersLosersPageRoutingModule {}
