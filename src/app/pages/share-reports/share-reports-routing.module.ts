import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShareReportsPage } from './share-reports.page';

const routes: Routes = [
  {
    path: '',
    component: ShareReportsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShareReportsPageRoutingModule {}
