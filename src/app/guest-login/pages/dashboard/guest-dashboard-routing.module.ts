import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuestDashboardRevampPage } from './guest-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: GuestDashboardRevampPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuestDashboardRevampPageRoutingModule {}
