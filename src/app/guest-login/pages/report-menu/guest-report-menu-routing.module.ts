import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuestReportMenuComponent } from './guest-report-menu.page';
const routes: Routes = [
    {
      path: '',
      component: GuestReportMenuComponent
    }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class GuestReportMenuComponentRoutingModule {}  