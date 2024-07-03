import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResearchReportsPage } from './research-reports.page';

const routes: Routes = [
  {
    path: '',
    component: ResearchReportsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResearchReportsPageRoutingModule {}
