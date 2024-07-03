import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportMenuComponent } from './report-menu.page';
const routes: Routes = [
    {
      path: '',
      component: ReportMenuComponent
    }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class ReportMenuComponentRoutingModule {}  