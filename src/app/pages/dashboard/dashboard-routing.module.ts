import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardRevampPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardRevampPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRevampPageRoutingModule {}
